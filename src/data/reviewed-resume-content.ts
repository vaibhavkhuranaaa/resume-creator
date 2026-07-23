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
    sourceRef: "8879c55997a475ea08b158fb689d1d7698d1fb16",
    variants: {
      legal: {
        bullets: [
          {
            text: "Built a Graph RAG investigation workspace combining cited evidence, entity relationships, vector retrieval, and reproducible evaluation for legal-data research.",
            evidenceRefs: [
              "legacy:legal-discovery-intelligence-graph:metric:1",
              "legacy:legal-discovery-intelligence-graph:metric:2",
              "legacy:legal-discovery-intelligence-graph:metric:3"
            ],
          },
        ],
        technologyOrder: ["Python", "LangChain", "Neo4j AuraDB", "PostgreSQL + pgvector", "Streamlit"],
      },
      general: {
        bullets: [
          {
            text: "Built a Graph RAG workspace combining vector search, entity relationships, cited evidence, and reproducible evaluation for complex investigation workflows.",
            evidenceRefs: [
              "legacy:legal-discovery-intelligence-graph:metric:1",
              "legacy:legal-discovery-intelligence-graph:metric:2",
              "legacy:legal-discovery-intelligence-graph:metric:3"
            ],
          },
        ],
      },
    },
  },
  "legal-document-intelligence-rag": {
    sourceRef: "60545cfc30ecd1af1c53072b381b0309a9524e50",
    variants: {
      legal: {
        bullets: [
          {
            text: "Built a citation-grounded document-intelligence workflow over public Delaware M&A litigation using Azure extraction, search, and retrieval-augmented generation.",
            evidenceRefs: [
              "legacy:legal-document-intelligence-rag:metric:1",
              "legacy:legal-document-intelligence-rag:metric:2",
              "legacy:legal-document-intelligence-rag:metric:3"
            ],
          },
        ],
      },
      general: {
        bullets: [
          {
            text: "Built an Azure document-intelligence RAG workflow that produces citation-grounded answers from controlled public legal source material.",
            evidenceRefs: [
              "legacy:legal-document-intelligence-rag:metric:1",
              "legacy:legal-document-intelligence-rag:metric:2",
              "legacy:legal-document-intelligence-rag:metric:3"
            ],
          },
        ],
      },
    },
  },
};
