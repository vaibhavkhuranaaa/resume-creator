import { z } from "zod";

export const resumeTypes = ["legal", "finance", "healthcare", "enterprise", "general"] as const;
export type ResumeType = (typeof resumeTypes)[number];
export const sectionKeys = ["summary", "experience", "projects", "skills", "education", "certifications"] as const;
export type SectionKey = (typeof sectionKeys)[number];

export const fontOptions = ["reference-serif", "classic-sans", "modern-serif"] as const;
export const accentOptions = ["charcoal", "navy", "slate", "burgundy", "forest"] as const;
export const bulletStyles = ["round", "square", "dash"] as const;

const idSchema = z.string().min(1, "Each item needs an ID.");
const textSchema = z.string();
const bulletSchema = z.object({ id: idSchema, text: textSchema });
const dateRangeSchema = z.object({
  startMonth: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(),
  endMonth: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(),
  current: z.boolean(),
  legacyDateText: z.string().optional(),
}).superRefine((date, context) => {
  if (!date.startMonth && !date.legacyDateText) context.addIssue({ code: "custom", message: "A start date is required." });
  if (date.current && date.endMonth) context.addIssue({ code: "custom", message: "A current role cannot have an end date." });
  if (date.startMonth && date.endMonth && date.startMonth > date.endMonth) context.addIssue({ code: "custom", message: "The end date cannot precede the start date." });
});

const contactLinkSchema = z.object({
  id: idSchema,
  kind: z.enum(["linkedin", "portfolio", "github", "email", "custom"]),
  label: z.string().min(1, "A link label is required."),
  displayText: z.string().min(1, "Visible link text is required."),
  url: z.string().url("Enter a complete URL, including https://."),
});

const experienceSchema = z.object({
  id: idSchema,
  organization: textSchema,
  title: textSchema,
  location: textSchema,
  date: dateRangeSchema,
  bullets: z.array(bulletSchema),
});
const educationSchema = z.object({ id: idSchema, institution: textSchema, degree: textSchema, date: dateRangeSchema });
const certificationSchema = z.object({ id: idSchema, issuer: textSchema, label: textSchema, note: textSchema });
const skillGroupSchema = z.object({ id: idSchema, label: textSchema, items: z.array(z.string().min(1)).default([]) });
const projectSchema = z.object({
  id: idSchema,
  catalogSlug: z.string().min(1),
  title: textSchema,
  technologies: z.array(z.string().min(1)),
  bullets: z.array(bulletSchema),
});

export const resumeDocumentSchema = z.object({
  version: z.literal(2),
  resumeType: z.enum(resumeTypes),
  templateId: z.literal("reference-ats"),
  page: z.object({ size: z.enum(["letter", "a4"]), fitMode: z.enum(["automatic", "force-one-page", "force-two-pages"]) }),
  appearance: z.object({ font: z.enum(fontOptions), accent: z.enum(accentOptions), bulletStyle: z.enum(bulletStyles), contactIcons: z.boolean() }),
  profile: z.object({ name: textSchema, headline: textSchema, location: textSchema, phone: textSchema, email: textSchema, summary: textSchema, links: z.array(contactLinkSchema) }),
  sectionOrder: z.array(z.enum(sectionKeys)).length(sectionKeys.length),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  skillGroups: z.array(skillGroupSchema),
  education: z.array(educationSchema),
  certifications: z.array(certificationSchema),
}).superRefine((document, context) => {
  if (new Set(document.sectionOrder).size !== sectionKeys.length) context.addIssue({ code: "custom", message: "Section order must include each section exactly once.", path: ["sectionOrder"] });
  const ids = new Set<string>();
  const add = (id: string, path: (string | number)[]) => {
    if (ids.has(id)) context.addIssue({ code: "custom", message: "Every item and bullet needs a unique ID.", path });
    ids.add(id);
  };
  document.profile.links.forEach((entry, index) => add(entry.id, ["profile", "links", index, "id"]));
  [document.experience, document.projects, document.skillGroups, document.education, document.certifications].forEach((collection, groupIndex) => collection.forEach((entry, index) => {
    add(entry.id, ["sections", groupIndex, index, "id"]);
    if ("bullets" in entry) entry.bullets.forEach((bullet, bulletIndex) => add(bullet.id, ["sections", groupIndex, index, "bullets", bulletIndex, "id"]));
  }));
});

export type ResumeDocument = z.infer<typeof resumeDocumentSchema>;
export type BulletItem = z.infer<typeof bulletSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type ResumeProject = z.infer<typeof projectSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type ContactLink = z.infer<typeof contactLinkSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
export type ValidationResult = { ok: true; value: ResumeDocument } | { ok: false; error: string };

export const makeId = () => crypto.randomUUID();

export function formatDate(date: DateRange) {
  if (date.legacyDateText && !date.startMonth) return date.legacyDateText;
  const readable = (value?: string) => value ? new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}-01T00:00:00Z`)) : "";
  const start = readable(date.startMonth);
  if (date.current) return `${start} - Present`;
  return date.endMonth ? `${start} - ${readable(date.endMonth)}` : start;
}

export function parseLegacyDate(value: string): DateRange {
  const normalized = value.replace(/[–—]/g, "-").trim();
  const months = [...normalized.matchAll(/(\d{1,2})\/(\d{4})/g)].map((match) => `${match[2]}-${match[1].padStart(2, "0")}`);
  if (months.length) return { startMonth: months[0], endMonth: /present/i.test(normalized) ? undefined : months[1], current: /present/i.test(normalized) };
  return { current: /present/i.test(normalized), legacyDateText: value };
}

function asObject(input: unknown): Record<string, unknown> | null { return input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : null; }
function asText(input: unknown) { return typeof input === "string" ? input : ""; }
function legacyBullets(input: unknown) { return Array.isArray(input) ? input.map((bullet) => { const entry = asObject(bullet); return { id: asText(entry?.id) || makeId(), text: asText(entry?.text) }; }) : []; }

export function migrateResumeDocument(input: unknown): ValidationResult {
  const current = resumeDocumentSchema.safeParse(input);
  if (current.success) return { ok: true, value: current.data };
  const legacy = asObject(input);
  if (!legacy || legacy.version !== 1) return { ok: false, error: "This file is not a supported V1 or V2 resume export." };
  const profile = asObject(legacy.profile);
  const legacyExperience = (entry: unknown) => {
    const value = asObject(entry);
    return { id: asText(value?.id) || makeId(), organization: asText(value?.organization), title: asText(value?.title), location: asText(value?.location), date: parseLegacyDate(asText(value?.dates)), bullets: legacyBullets(value?.bullets) };
  };
  const legacyEducation = (entry: unknown) => {
    const value = asObject(entry);
    return { id: asText(value?.id) || makeId(), institution: asText(value?.institution), degree: asText(value?.degree), date: parseLegacyDate(asText(value?.dates)) };
  };
  const rawProjects = Array.isArray(legacy.projects) ? legacy.projects : [];
  const migrated: ResumeDocument = {
    version: 2,
    resumeType: resumeTypes.includes(legacy.resumeType as ResumeType) ? legacy.resumeType as ResumeType : "general",
    templateId: "reference-ats",
    page: { size: "letter", fitMode: "automatic" },
    appearance: { font: "reference-serif", accent: "navy", bulletStyle: "round", contactIcons: false },
    profile: {
      name: asText(profile?.name), headline: asText(profile?.headline), location: asText(profile?.location), phone: asText(profile?.phone), email: asText(profile?.email), summary: asText(profile?.summary),
      links: asText(profile?.linkedin) ? [{ id: makeId(), kind: "linkedin", label: "LinkedIn", displayText: asText(profile?.linkedin).replace(/^https?:\/\//, ""), url: /^https?:\/\//.test(asText(profile?.linkedin)) ? asText(profile?.linkedin) : `https://${asText(profile?.linkedin)}` }] : [],
    },
    sectionOrder: Array.isArray(legacy.sectionOrder) ? legacy.sectionOrder.filter((value): value is SectionKey => sectionKeys.includes(value as SectionKey)) : [...sectionKeys],
    experience: (Array.isArray(legacy.experience) ? legacy.experience : []).map(legacyExperience),
    projects: rawProjects.map((entry) => { const value = asObject(entry); return { id: asText(value?.id) || makeId(), catalogSlug: asText(value?.catalogSlug), title: asText(value?.title), technologies: asText(value?.technologies).split(",").map((item) => item.trim()).filter(Boolean), bullets: legacyBullets(value?.bullets) }; }),
    skillGroups: (Array.isArray(legacy.skillGroups) ? legacy.skillGroups : []).map((entry) => { const value = asObject(entry); return { id: asText(value?.id) || makeId(), label: asText(value?.label), items: asText(value?.items).split(",").map((item) => item.trim()).filter(Boolean) }; }),
    education: (Array.isArray(legacy.education) ? legacy.education : []).map(legacyEducation),
    certifications: (Array.isArray(legacy.certifications) ? legacy.certifications : []).map((entry) => { const value = asObject(entry); return { id: asText(value?.id) || makeId(), issuer: asText(value?.issuer), label: asText(value?.label), note: asText(value?.note) }; }),
  };
  if (migrated.sectionOrder.length !== sectionKeys.length || new Set(migrated.sectionOrder).size !== sectionKeys.length) migrated.sectionOrder = [...sectionKeys];
  const checked = resumeDocumentSchema.safeParse(migrated);
  return checked.success ? { ok: true, value: checked.data } : { ok: false, error: checked.error.issues[0]?.message ?? "The imported resume could not be migrated." };
}

export function validateResumeDocument(input: unknown): ValidationResult {
  const result = resumeDocumentSchema.safeParse(input);
  return result.success ? { ok: true, value: result.data } : { ok: false, error: result.error.issues[0]?.message ?? "The resume is invalid." };
}
