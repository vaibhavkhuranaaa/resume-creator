import approvedCatalog from "@/data/approved-projects.json";
import {
  reviewedResumeContent,
  type ReviewedVariant,
} from "@/data/reviewed-resume-content";
import type { ResumeType } from "@/lib/schema";

type ApprovedProject = (typeof approvedCatalog.projects)[number];

export type CatalogProject = {
  slug: string;
  title: string;
  liveUrl: string | null;
  technologies: string[];
  sourceRef: string;
  sourceUrl: string;
  evidenceIds: string[];
  resumeVariants: Partial<Record<ResumeType, ReviewedVariant>>;
};

function validateResumeContent(project: ApprovedProject, variants: Partial<Record<ResumeType, ReviewedVariant>>) {
  const evidenceIds = new Set(project.evidence.map((evidence) => evidence.id));
  for (const [resumeType, variant] of Object.entries(variants)) {
    for (const bullet of variant?.bullets ?? []) {
      if (!bullet.evidenceRefs.length) throw new Error(`${project.slug}/${resumeType}: bullet requires evidence`);
      const unknown = bullet.evidenceRefs.filter((reference) => !evidenceIds.has(reference));
      if (unknown.length) throw new Error(`${project.slug}/${resumeType}: unknown evidence ${unknown.join(", ")}`);
    }
  }
}

export const catalogMetadata = {
  generatedAt: approvedCatalog.generatedAt,
  importedFrom: approvedCatalog.importedFrom,
  sourceRefs: approvedCatalog.projects.map((project) => ({
    slug: project.slug,
    sourceRef: project.source.sourceRef,
  })),
} as const;

export const projectCatalog: CatalogProject[] = approvedCatalog.projects.map((project) => {
  const reviewed = reviewedResumeContent[project.slug];
  if (!reviewed) throw new Error(`${project.slug}: approved project is missing reviewed resume presentation content`);
  validateResumeContent(project, reviewed.variants);
  return {
    slug: project.slug,
    title: project.title,
    liveUrl:
      project.deployment.status === "live" && "verifiedAt" in project.deployment && project.deployment.verifiedAt
        ? project.deployment.liveUrl
        : null,
    technologies: project.stack,
    sourceRef: project.source.sourceRef,
    sourceUrl: project.source.url,
    evidenceIds: project.evidence.map((evidence) => evidence.id),
    resumeVariants: reviewed.variants,
  };
});

export const getCatalogProject = (slug: string) => projectCatalog.find((project) => project.slug === slug);
export const getVerifiedProjectLiveUrl = (slug: string) => getCatalogProject(slug)?.liveUrl ?? null;
export const getProjectVariant = (slug: string, resumeType: ResumeType) => {
  const project = getCatalogProject(slug);
  if (!project) return null;
  return project.resumeVariants[resumeType] ?? project.resumeVariants.general ?? null;
};
