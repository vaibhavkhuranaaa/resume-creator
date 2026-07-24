import type { ResumeType } from "@/lib/schema";

export type ReviewedBullet = {
  text: string;
  evidenceRefs: string[];
};

export type ReviewedVariant = {
  bullets: ReviewedBullet[];
  technologyOrder?: string[];
};

export type ReviewedResumeContent = {
  sourceRef: string;
  variants: Partial<Record<ResumeType, ReviewedVariant>>;
};

// Resume-specific language remains reviewable here. Project titles, URLs, stack,
// deployment state, and evidence records come only from the generated catalog.
export const reviewedResumeContent: Record<string, ReviewedResumeContent> = {
  "legal-discovery-intelligence-graph": {
    sourceRef: "c893da65f17121cf8616f1865f946efec2cf935d",
    variants: {
      legal: {
        bullets: [
          {
            text: "Built and deployed a Graph RAG investigation workspace with Flask, pgvector, Neo4j, ONNX embeddings, cited evidence, and calibrated refusal over a 455-document synthetic corpus.",
            evidenceRefs: [
              "evaluation.entity-extraction",
              "evaluation.hybrid-retrieval",
              "deployment.render-root"
            ],
          },
        ],
        technologyOrder: ["Python", "Flask", "PostgreSQL + pgvector", "Neo4j AuraDB", "ONNX Runtime"],
      },
      general: {
        bullets: [
          {
            text: "Built an evidence-first investigation workspace combining vector and graph retrieval, cited synthetic documents, calibrated refusal, and reproducible evaluation.",
            evidenceRefs: [
              "evaluation.entity-extraction",
              "evaluation.hybrid-retrieval"
            ],
          },
        ],
      },
    },
  },
  "legal-document-intelligence-rag": {
    sourceRef: "feeefeba500881f6624edf984340f618b2b41bb8",
    variants: {
      legal: {
        bullets: [
          {
            text: "Built an Azure RAG workspace with citation-required generation over 3,055 chunks derived from registered public legal documents.",
            evidenceRefs: [
              "evaluation.release-v2",
              "disclosure.public-corpus",
              "deployment.azure-root"
            ],
          },
        ],
      },
      general: {
        bullets: [
          {
            text: "Built and evaluated an evidence-first Azure document-intelligence workflow with traceable citations and an explicit refusal path.",
            evidenceRefs: [
              "evaluation.release-v2",
              "disclosure.public-corpus"
            ],
          },
        ],
      },
    },
  },
  "text-to-sql-guardrails": {
    sourceRef: "9b05287ce2598ad82920fc1c1dd19c1b62aec3f9",
    variants: {
      finance: {
        bullets: [
          {
            text: "Built an approval-gated Text-to-SQL service with Azure OpenAI, Microsoft Entra ID, SQLGlot, FastAPI, and read-only DuckDB execution, matching all 18 deterministic safety and correctness cases.",
            evidenceRefs: [
              "evaluation.local-policy",
              "integration.entra-proposal-lifecycle"
            ],
          },
          {
            text: "Deployed a scale-to-zero Azure Container Apps demo with immutable image, synthetic-data boundary, rate/budget controls, and explicit non-production limitations.",
            evidenceRefs: [
              "deployment.temporary-demo",
              "security.container-data-boundary",
              "disclosure.synthetic-data"
            ],
          },
        ],
        technologyOrder: ["Python", "FastAPI", "SQLGlot", "DuckDB", "Azure OpenAI", "Azure Container Apps"],
      },
      general: {
        bullets: [
          {
            text: "Designed and deployed a guarded natural-language analytics workflow that separates model proposals, deterministic SQL policy, human approval, and bounded read-only execution.",
            evidenceRefs: [
              "evaluation.local-policy",
              "deployment.temporary-demo"
            ],
          },
        ],
      },
    },
  },
};
