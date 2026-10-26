
import { getTechnology } from "../technologies.js";

// Real case studies will be registered here.
// Task 11 intentionally starts with an empty registry.
export const caseStudies = [];

export function validateCaseStudies(studies) {
  const slugs = new Set();

  for (const study of studies) {
    if (
      !study ||
      typeof study.slug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(study.slug)
    ) {
      throw new Error("Invalid case-study slug");
    }

    if (slugs.has(study.slug)) {
      throw new Error(
        `Duplicate case-study slug: ${study.slug}`,
      );
    }

    slugs.add(study.slug);

    for (const field of ["title", "summary"]) {
      const value = study[field];

      if (
        !value ||
        typeof value.en !== "string" ||
        typeof value.ru !== "string" ||
        !value.en.trim() ||
        !value.ru.trim()
      ) {
        throw new Error(
          `Case study "${study.slug}" requires bilingual ${field}`,
        );
      }
    }

    if (!Array.isArray(study.technologies)) {
      throw new Error(
        `Case study "${study.slug}" requires technologies`,
      );
    }

    for (const technologyId of study.technologies) {
      if (!getTechnology(technologyId)) {
        throw new Error(
          `Case study "${study.slug}" references unknown technology "${technologyId}"`,
        );
      }
    }
  }

  return true;
}

// Validate real registry entries at module initialization.
validateCaseStudies(caseStudies);

const caseStudyBySlug = new Map(
  caseStudies.map((study) => [study.slug, study]),
);

export function getCaseStudyBySlug(slug) {
  return caseStudyBySlug.get(slug) ?? null;
}
