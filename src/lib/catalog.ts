import type { ResumeType } from "@/lib/schema";

export type CatalogProject = {
  slug: string;
  title: string;
  liveUrl: string | null;
  technologies: string[];
  resumeVariants: Partial<Record<ResumeType, { bullets: string[]; technologyOrder?: string[] }>>;
};

const variant = (bullet: string, technologyOrder?: string[]) => ({ bullets: [bullet], technologyOrder });

// Resume-facing records are derived from reviewed local project manifests. Repository URLs and
// disclosures deliberately remain outside the printable resume catalog.
export const projectCatalog: CatalogProject[] = [
  { slug: "legal-discovery-intelligence-graph", title: "Legal Discovery Intelligence Graph", liveUrl: "https://legal-discovery-intelligence-graph.onrender.com", technologies: ["Python", "Flask", "LangChain", "PostgreSQL + pgvector", "Neo4j AuraDB", "Supabase", "Plotly"], resumeVariants: {
    legal: variant("Built a Graph RAG investigation workspace that combines cited evidence, entity relationships, vector retrieval, and reproducible evaluation for legal-data research.", ["Python", "LangChain", "Neo4j AuraDB", "PostgreSQL + pgvector", "Flask"]),
    general: variant("Built a deployed Graph RAG workspace combining vector search, entity relationships, cited evidence, and reproducible evaluation for complex investigation workflows."),
  } },
  { slug: "legal-document-intelligence-rag", title: "Legal Document Intelligence RAG", liveUrl: "https://app-legal-rag-prod-278f1d.azurewebsites.net/", technologies: ["Python", "Flask", "Azure Document Intelligence", "Azure OpenAI", "Azure AI Search", "Azure Blob Storage"], resumeVariants: {
    legal: variant("Built a citation-grounded document-intelligence workflow over public Delaware M&A litigation using Azure extraction, search, and retrieval-augmented generation."),
    general: variant("Built an Azure-based document-intelligence RAG workflow that produces citation-grounded answers from public legal source material."),
  } },
  { slug: "financial-payments-fraud-pipeline", title: "Financial Payments Fraud Pipeline", liveUrl: null, technologies: ["Python", "Redpanda", "Spark Structured Streaming", "XGBoost", "Redis", "Flask", "Docker", "Azure"], resumeVariants: {
    finance: variant("Built an event-driven fraud analytics pipeline with contract validation, streaming features, online scoring, and operational dashboards.", ["Python", "Spark Structured Streaming", "Redpanda", "XGBoost", "Redis", "Azure"]),
    general: variant("Built an event-driven data and machine-learning pipeline with streaming features, online scoring, validation, and operational observability."),
  } },
  { slug: "financial-aml-graph-detection", title: "Financial AML Graph Detection", liveUrl: null, technologies: ["Python", "Graph machine learning", "Docker"], resumeVariants: {
    finance: variant("Developed a graph machine-learning research pipeline for identifying suspicious transaction patterns in the public Elliptic Bitcoin dataset."),
  } },
  { slug: "healthcare-sepsis-prediction", title: "Sepsis Early Warning", liveUrl: null, technologies: ["Python", "XGBoost", "Flask", "MLflow", "Docker", "Azure"], resumeVariants: {
    healthcare: variant("Built a synthetic-demo workflow for ICU deterioration-risk modeling with calibration, MLOps tracking, and explicit safety controls."),
  } },
  { slug: "healthcare-phi-deidentification", title: "Healthcare PHI De-identification", liveUrl: null, technologies: ["Python", "Named-entity recognition", "Docker"], resumeVariants: {
    healthcare: variant("Built a clinical-text de-identification service that identifies and redacts protected-health-information entities using named-entity recognition."),
  } },
  { slug: "supplychain-disruption-agent", title: "Supply Chain Disruption Agent", liveUrl: null, technologies: ["Python", "LangGraph", "GDELT", "Docker"], resumeVariants: {
    enterprise: variant("Built a LangGraph agent that monitors public-event signals and produces source-grounded supply-chain disruption briefs."),
  } },
  { slug: "supplychain-predictive-maintenance", title: "Supply Chain Predictive Maintenance", liveUrl: null, technologies: ["Python", "Machine learning", "Docker"], resumeVariants: {
    enterprise: variant("Built a predictive-maintenance workflow for remaining-useful-life forecasting on NASA C-MAPSS turbofan benchmark data."),
  } },
];

export const getCatalogProject = (slug: string) => projectCatalog.find((project) => project.slug === slug);
export const getVerifiedProjectLiveUrl = (slug: string) => getCatalogProject(slug)?.liveUrl ?? null;
export const getProjectVariant = (slug: string, resumeType: ResumeType) => {
  const project = getCatalogProject(slug);
  if (!project) return null;
  return project.resumeVariants[resumeType] ?? project.resumeVariants.general ?? variant("Describe the project using reviewed facts from the project catalog.");
};
