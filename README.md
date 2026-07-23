# Vaibhav Khurana Resume Editor

A client-only, no-auth resume editor with local browser drafts and an ATS-safe printable preview based on `Vaibhav_Khurana_Resume_Kirkland_Ellis.pdf`.

## Local use

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, choose a resume type, then select **Start from default**. Drafts are saved only in that browser. Use **Download JSON** to transfer an editable draft and **Print / Save PDF** to create the final ATS-friendly PDF. The editor accepts legacy V1 exports and migrates them to the V2 structured format.

## Resume behavior

- Edit and reorder experience, structured dates, project bullets, technologies, skills, education, certifications, header links, and section order.
- Project titles contain a link only when the reviewed catalog has a verified live deployment. GitHub labels, separate demo labels, repository URLs, and disclosures are never rendered.
- Appearance presets cover font family, professional accent color, bullet style, contact icons, Letter/A4, and one/two-page fitting. Automatic fitting never reduces body copy below 9.5pt; it switches to two pages instead.

## Deployment

The app uses `output: "export"`; it has no server routes, environment variables, secrets, analytics, databases, or remote write APIs. Import this directory into Vercel as a Next.js project and deploy with the standard build command (`npm run build`). Vercel serves the static `out/` export.

## Safety and catalog policy

- Project records are normalized from reviewed workspace manifests and resume variants are limited to verified facts.
- The selection guide references several projects without local manifests. They are intentionally absent from the shipped defaults until reviewed catalog data is supplied; the app never fabricates those projects, links, or metrics.
