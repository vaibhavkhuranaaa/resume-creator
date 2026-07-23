import { migrateResumeDocument, type ResumeDocument } from "@/lib/schema";

const v2Key = "vaibhav-resume-editor:draft:v2";
const v1Key = "vaibhav-resume-editor:draft:v1";

export type DraftLoadResult = { document: ResumeDocument | null; recovered: boolean };

export function loadDraft(): DraftLoadResult {
  try {
    const v2 = localStorage.getItem(v2Key);
    if (v2) {
      const result = migrateResumeDocument(JSON.parse(v2));
      return { document: result.ok ? result.value : null, recovered: !result.ok };
    }
    const v1 = localStorage.getItem(v1Key);
    if (!v1) return { document: null, recovered: false };
    const result = migrateResumeDocument(JSON.parse(v1));
    if (!result.ok) return { document: null, recovered: true };
    saveDraft(result.value);
    return { document: result.value, recovered: false };
  } catch { return { document: null, recovered: true }; }
}

export function saveDraft(document: ResumeDocument) { localStorage.setItem(v2Key, JSON.stringify(document)); }
export function clearDraft() { localStorage.removeItem(v2Key); }
