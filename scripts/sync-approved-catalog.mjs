import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const destination = resolve("src/data/approved-projects.json");
const shaPattern = /^[0-9a-f]{40}$/;

function validateCatalog(catalog, label) {
  if (catalog?.schemaVersion !== 1 || !Array.isArray(catalog.projects)) {
    throw new Error(`${label}: expected approved catalog schemaVersion 1`);
  }
  if (!catalog.generatedAt || Number.isNaN(Date.parse(catalog.generatedAt))) {
    throw new Error(`${label}: generatedAt must be an ISO timestamp`);
  }
  const slugs = new Set();
  for (const project of catalog.projects) {
    if (!project.slug || slugs.has(project.slug)) throw new Error(`${label}: duplicate or missing project slug`);
    slugs.add(project.slug);
    if (project.portfolio?.status !== "approved") throw new Error(`${project.slug}: only approved projects are allowed`);
    if (!shaPattern.test(project.source?.sourceRef ?? "")) throw new Error(`${project.slug}: sourceRef must be an exact SHA`);
    if (!/^https:\/\/github\.com\//.test(project.source?.url ?? "")) throw new Error(`${project.slug}: public source URL is required`);
    const evidence = new Set((project.evidence ?? []).map((item) => item.id));
    for (const candidate of project.resumeBulletCandidates ?? []) {
      if (!candidate.evidenceRefs?.length) throw new Error(`${project.slug}: resume bullet requires evidence`);
      const unknown = candidate.evidenceRefs.filter((reference) => !evidence.has(reference));
      if (unknown.length) throw new Error(`${project.slug}: unknown bullet evidence ${unknown.join(", ")}`);
    }
  }
  return catalog;
}

if (process.argv.includes("--check")) {
  validateCatalog(JSON.parse(await readFile(destination, "utf8")), destination);
  console.log(`Validated approved resume catalog at ${destination}`);
} else {
  const source = resolve(
    process.env.RESUME_CATALOG_SOURCE ?? process.argv[2] ?? "../portfolio-site/public/data/approved-projects.json",
  );
  const catalog = validateCatalog(JSON.parse(await readFile(source, "utf8")), source);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify({ ...catalog, importedFrom: source }, null, 2)}\n`);
  console.log(`Synchronized ${catalog.projects.length} approved projects from ${source}`);
}
