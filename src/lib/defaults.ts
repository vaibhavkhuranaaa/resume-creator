import { getCatalogProject, getProjectVariant } from "@/lib/catalog";
import { makeId, parseLegacyDate, type ResumeDocument, type ResumeProject, type ResumeType } from "@/lib/schema";

const selectedProjects: Record<ResumeType, string[]> = {
  legal: ["legal-discovery-intelligence-graph", "legal-document-intelligence-rag"],
  finance: ["financial-payments-fraud-pipeline", "financial-aml-graph-detection"],
  healthcare: ["healthcare-sepsis-prediction", "healthcare-phi-deidentification"],
  enterprise: ["supplychain-disruption-agent", "supplychain-predictive-maintenance"],
  general: ["financial-payments-fraud-pipeline", "legal-discovery-intelligence-graph"],
};

const makeProject = (slug: string, resumeType: ResumeType): ResumeProject => {
  const project = getCatalogProject(slug);
  const content = getProjectVariant(slug, resumeType);
  if (!project || !content) throw new Error(`Default project ${slug} is not in the reviewed catalog.`);
  const technologies = content.technologyOrder ? [...content.technologyOrder, ...project.technologies.filter((item) => !content.technologyOrder!.includes(item))] : project.technologies;
  return { id: makeId(), catalogSlug: slug, title: project.title, technologies, bullets: content.bullets.map((text) => ({ id: makeId(), text })) };
};

export function createDefaultResume(resumeType: ResumeType = "legal"): ResumeDocument {
  return {
    version: 2, resumeType, templateId: "reference-ats",
    page: { size: "letter", fitMode: "automatic" },
    appearance: { font: "reference-serif", accent: "navy", bulletStyle: "round", contactIcons: false },
    profile: {
      name: "VAIBHAV KHURANA", headline: "", location: "Chicago, IL", phone: "(312) 978-0317", email: "vaibhavkhurana.data@gmail.com",
      links: [{ id: makeId(), kind: "linkedin", label: "LinkedIn", displayText: "linkedin.com/in/vaibhavkhuranaaa", url: "https://linkedin.com/in/vaibhavkhuranaaa" }],
      summary: "Data analyst building data infrastructure, eDiscovery tooling, and self-service analytics at scale. AWS Certified, fluent in Python, SQL, and Snowflake, with hands-on experience in entity recognition, Informatica DQ, and cloud data pipelines. Eliminated over $300,000 in annual costs and cut reporting turnaround from days to minutes across legal, financial, and case-level reporting.",
    },
    sectionOrder: ["summary", "experience", "projects", "skills", "education", "certifications"],
    experience: [
      { id: makeId(), organization: "Morgan & Morgan, P.A.", title: "Data Analyst", location: "Remote", date: parseLegacyDate("09/2024 - Present"), bullets: [
        { id: makeId(), text: "Built a named entity recognition pipeline in Python, using spaCy and custom regex, tagging people, dates, locations, and document types across thousands of OCR-processed case files and feeding structured output into the firm's Relativity-based review system." },
        { id: makeId(), text: "Automated recurring reporting through Power Query, Power Automate, and advanced VBA, cutting manual Excel processing time across legal and case operations." },
        { id: makeId(), text: "Built a Python-based self-service reporting platform on UKG Pro's API, S3 financial, and case data, cutting report turnaround from three to five days to under fifteen minutes." },
      ] },
      { id: makeId(), organization: "Hellowiz", title: "Data Analyst (Volunteer)", location: "Chicago, IL", date: parseLegacyDate("06/2024 - 09/2024"), bullets: [{ id: makeId(), text: "Cut cross-tenant reporting errors 23% by realigning schemas across NGO client databases and building AWS Glue pipelines into a governed multi-tenant analytics layer in S3." }] },
      { id: makeId(), organization: "University of Illinois Chicago", title: "Graduate Teaching Assistant & LTS Support", location: "Chicago, IL", date: parseLegacyDate("08/2022 - 05/2024"), bullets: [{ id: makeId(), text: "Restructured R lab curriculum on regression and machine learning fundamentals for 200+ graduate students, and designed a real-data default-risk project used for grading across sections." }] },
    ],
    projects: selectedProjects[resumeType].map((slug) => makeProject(slug, resumeType)),
    skillGroups: [
      { id: makeId(), label: "Languages", items: ["Python", "SQL", "R", "Pandas", "NumPy", "PySpark", "DAX", "Git"] },
      { id: makeId(), label: "Cloud & Data Engineering", items: ["AWS", "Azure", "Snowflake", "dbt", "Informatica DQ", "Power Query", "Power Automate", "VBA", "UKG Pro", "Qualtrics"] },
      { id: makeId(), label: "Databases", items: ["PostgreSQL", "MS SQL Server", "BigQuery", "Neo4j", "pgvector"] },
      { id: makeId(), label: "Machine Learning", items: ["scikit-learn", "XGBoost", "LightGBM", "TensorFlow", "PyTorch", "spaCy"] },
    ],
    education: [
      { id: makeId(), institution: "University of Illinois Chicago", degree: "M.S., Business Analytics (Data Science Concentration)", date: parseLegacyDate("08/2023 - 05/2024") },
      { id: makeId(), institution: "University of Illinois Chicago", degree: "B.S., Information Decision Sciences (Business Analytics Concentration)", date: parseLegacyDate("01/2020 - 08/2023") },
    ],
    certifications: [],
  };
}
