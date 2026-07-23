# Resume Creator agent contract

## Authority

- Approved project facts, URLs, source SHAs, and evidence: `src/data/approved-projects.json`, generated from the portfolio-site approved catalog.
- Résumé-specific wording and technology ordering: `src/data/reviewed-resume-content.ts`, pinned to the same source SHA and evidence IDs.
- Default project selection: `src/lib/defaults.ts`.
- User-edited drafts: browser-local state only; never a project-fact authority.
- Current work and continuation: `docs/STATE.md` and `docs/HANDOFF.md`.

## Working rules

- Query fresh Graphify output first when it covers the changed files; inspect source directly when missing or stale.
- Preserve static export, local-only drafts, no authentication, and no remote writes.
- Never add a project, URL, metric, or résumé bullet that is absent from the approved catalog or lacks evidence.
- Treat `src/data/approved-projects.json` as generated: update it with `npm run catalog:sync`, never by hand.
- A deployment URL is printable only when the catalog carries live-profile verification; a legacy `status: live` claim is insufficient.
- Preserve unrelated dirty changes. Use purpose branches, conventional commits, and the configured human identity; never add an AI/model author or co-author.
- Run catalog validation, tests, lint, and the static build for changes.

## Next.js exception

This app uses Next.js 16 static export. Read the relevant local guide under `node_modules/next/dist/docs/` before changing framework behavior.
