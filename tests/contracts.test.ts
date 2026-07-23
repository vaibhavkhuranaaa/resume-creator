import assert from "node:assert/strict";
import test from "node:test";
import { createDefaultResume } from "../src/lib/defaults";
import { catalogMetadata, getCatalogProject, getProjectVariant, getVerifiedProjectLiveUrl } from "../src/lib/catalog";
import { formatDate, migrateResumeDocument, parseLegacyDate, validateResumeDocument } from "../src/lib/schema";

test("every resume type has a valid catalog-backed default with no more than three projects", () => {
  for (const type of ["legal", "finance", "healthcare", "enterprise", "general"] as const) {
    const document = createDefaultResume(type);
    assert.equal(document.projects.length <= 3, true);
    assert.equal(validateResumeDocument(document).ok, true);
    document.projects.forEach((project) => assert.ok(getCatalogProject(project.catalogSlug)));
  }
});

test("V1 exports migrate contact links, dates, technologies, and bullets into V2", () => {
  const legacy = {
    version: 1, resumeType: "legal", profile: { name: "V", location: "Chicago", phone: "1", email: "v@example.com", linkedin: "linkedin.com/in/v", headline: "", summary: "Summary" },
    sectionOrder: ["summary", "experience", "projects", "skills", "education", "certifications"],
    experience: [{ id: "exp", organization: "Org", title: "Role", location: "Remote", dates: "09/2024 – Present", bullets: [{ id: "bullet", text: "Fact" }] }],
    projects: [{ id: "project", catalogSlug: "legal-discovery-intelligence-graph", title: "Project", technologies: "Python, Neo4j", githubUrl: "https://example.com", liveUrl: "https://bad.example", disclaimer: "Hidden", bullets: [{ id: "project-bullet", text: "Fact" }] }],
    skillGroups: [{ id: "skills", label: "Languages", items: "Python, SQL" }], education: [], certifications: [],
  };
  const result = migrateResumeDocument(legacy);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.version, 2);
  assert.equal(result.value.profile.links[0].url, "https://linkedin.com/in/v");
  assert.deepEqual(result.value.projects[0].technologies, ["Python", "Neo4j"]);
  assert.equal(formatDate(result.value.experience[0].date), "Sep 2024 - Present");
  assert.equal("githubUrl" in result.value.projects[0], false);
});

test("only live-profile verified deployments can be used as project-title links", () => {
  assert.equal(getVerifiedProjectLiveUrl("legal-discovery-intelligence-graph"), null);
  assert.equal(getVerifiedProjectLiveUrl("financial-payments-fraud-pipeline"), null);
  assert.equal(getVerifiedProjectLiveUrl("unknown-project"), null);
});

test("catalog metadata pins every project and every resume bullet resolves to approved evidence", () => {
  assert.match(catalogMetadata.generatedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(catalogMetadata.sourceRefs.every((project) => /^[0-9a-f]{40}$/.test(project.sourceRef)), true);
  for (const type of ["legal", "finance", "healthcare", "enterprise", "general"] as const) {
    for (const project of createDefaultResume(type).projects) {
      const catalogProject = getCatalogProject(project.catalogSlug);
      const variant = getProjectVariant(project.catalogSlug, type);
      assert.ok(catalogProject);
      assert.ok(variant);
      for (const bullet of variant.bullets) {
        assert.equal(bullet.evidenceRefs.length > 0, true);
        assert.equal(bullet.evidenceRefs.every((reference) => catalogProject.evidenceIds.includes(reference)), true);
      }
    }
  }
});

test("dates render consistently and reject inverted ranges", () => {
  assert.equal(formatDate(parseLegacyDate("08/2023 - 05/2024")), "Aug 2023 - May 2024");
  const document = createDefaultResume();
  document.experience[0].date = { startMonth: "2025-03", endMonth: "2024-02", current: false };
  assert.equal(validateResumeDocument(document).ok, false);
});

test("V2 rejects duplicate item identifiers and malformed link URLs", () => {
  const document = createDefaultResume();
  document.projects[0].id = document.experience[0].id;
  assert.equal(validateResumeDocument(document).ok, false);
  const another = createDefaultResume();
  another.profile.links[0].url = "not-a-url";
  assert.equal(validateResumeDocument(another).ok, false);
});
