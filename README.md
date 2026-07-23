# Vaibhav Khurana Resume Editor

A client-only, no-auth resume editor with local browser drafts and an ATS-safe printable preview. Approved project facts come from the portfolio-site catalog; résumé-specific wording remains reviewable and evidence-linked.

## Local use

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, choose a resume type, then select **Start from default**. Drafts are saved only in that browser. Use **Download JSON** to transfer an editable draft and **Print / Save PDF** to create the final ATS-friendly PDF. The editor accepts legacy V1 exports and migrates them to the V2 structured format.

## Resume behavior

- Edit and reorder experience, structured dates, project bullets, technologies, skills, education, certifications, header links, and section order.
- Project titles contain a link only when the approved catalog has a v2 live-profile verification. GitHub labels, separate demo labels, repository URLs, and disclosures are never rendered.
- Appearance presets cover font family, professional accent color, bullet style, contact icons, Letter/A4, and one/two-page fitting. Automatic fitting never reduces body copy below 9.5pt; it switches to two pages instead.

## Catalog synchronization

The committed `src/data/approved-projects.json` is a generated snapshot so static and offline builds remain reproducible. Refresh it only after the portfolio-site has generated its approved catalog:

```bash
npm run catalog:sync
npm run catalog:validate
```

The snapshot includes generation time and the exact source SHA for every project. `src/data/reviewed-resume-content.ts` owns role-specific wording and must pin the same SHA and evidence IDs. Missing or stale mappings fail the build.

## Deployment boundary

The app uses `output: "export"`; it has no server routes, environment variables, secrets, analytics, databases, or remote write APIs. `npm run build` writes the static `out/` export. Deployment remains a separate owner-gated action.

## Safety and catalog policy

- Project records are normalized from approved, exact-SHA manifests and résumé variants are limited to evidence-linked facts.
- Projects absent from the approved catalog are absent from shipped defaults. Default selection falls back to currently approved projects instead of fabricating records.
