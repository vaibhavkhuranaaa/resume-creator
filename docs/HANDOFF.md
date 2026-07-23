# Handoff

## Resume point

The formerly unversioned app has a clean baseline commit and is registered in `portfolio-os/ops/repository-inventory.yml`. Project facts now come from a generated approved catalog. Résumé-only language is source-SHA pinned and every bullet maps to catalog evidence.

## Continue safely

1. Run `npm run catalog:validate`.
2. Run `npm test`, `npm run lint`, and `npm run build`.
3. To refresh approved facts, first generate `portfolio-site/public/data/approved-projects.json`, then run `npm run catalog:sync` here.
4. Review any source-SHA mismatch in `src/data/reviewed-resume-content.ts`; update wording only after checking the new evidence.
5. Do not restore removed unapproved projects as hard-coded facts. They re-enter only after portfolio approval produces a catalog record.

No remote, deployment, or publication action is implied by this handoff.
