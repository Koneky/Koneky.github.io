
import test from "node:test";
import assert from "node:assert/strict";

import {
  getCaseStudyBySlug,
  validateCaseStudies,
} from "../src/data/caseStudies/index.js";

import {
  getTechnology,
} from "../src/data/technologies.js";

// Test-only fixture. Not a real portfolio case study.
function createCaseStudyFixture(
  slug = "fixture-project",
  technologyIds = ["flutter", "dart"],
) {
  return {
    slug,
    title: {
      en: "Fixture title",
      ru: "Тестовый заголовок",
    },
    summary: {
      en: "Fixture summary",
      ru: "Тестовое описание",
    },
    technologies: technologyIds,
  };
}

test("unknown case-study slug returns null", () => {
  assert.equal(
    getCaseStudyBySlug("not-real"),
    null,
  );
});

test("case study allows all optional sections to be omitted", () => {
  const study = createCaseStudyFixture();

  assert.equal(
    validateCaseStudies([study]),
    true,
  );

  for (const key of [
    "role",
    "challenge",
    "solution",
    "architecture",
    "gallery",
    "results",
    "links",
  ]) {
    assert.equal(study[key], undefined);
  }
});

test("case-study technology IDs must exist in the canonical registry", () => {
  const study = createCaseStudyFixture();

  for (const technologyId of study.technologies) {
    assert.ok(
      getTechnology(technologyId),
      `Unknown fixture technology: ${technologyId}`,
    );
  }

  assert.equal(
    validateCaseStudies([study]),
    true,
  );

  const invalidStudy = createCaseStudyFixture(
    "invalid-technologies",
    ["flutter", "not-a-real-technology"],
  );

  assert.throws(
    () => validateCaseStudies([invalidStudy]),
    /unknown technology/i,
  );
});

test("duplicate case-study slugs are rejected", () => {
  const studies = [
    createCaseStudyFixture("same-slug"),
    createCaseStudyFixture("same-slug"),
  ];

  assert.throws(
    () => validateCaseStudies(studies),
    /duplicate.*slug/i,
  );
});
