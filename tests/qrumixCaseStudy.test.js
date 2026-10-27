import test from "node:test";
import assert from "node:assert/strict";

import { getCaseStudyBySlug } from "../src/data/caseStudies/index.js";

import { getProjectById } from "../src/data/projects.js";

import { getTechnology } from "../src/data/technologies.js";

const APPROVED_UPDATES_URL = "https://github.com/Koneky/qrumix-app-updates";

function getQrumixStudy() {
  const study = getCaseStudyBySlug("qrumix");

  assert.ok(study, "QRumiX case study must be registered");

  return study;
}

function assertBilingualText(value, field) {
  assert.ok(value, `${field} is required`);

  for (const language of ["ru", "en"]) {
    assert.equal(
      typeof value[language],
      "string",
      `${field}.${language} must be a string`,
    );

    assert.ok(
      value[language].trim().length > 0,
      `${field}.${language} must not be empty`,
    );
  }
}

test("QRumiX case study has the canonical slug and project mapping", () => {
  const study = getQrumixStudy();
  const project = getProjectById("qrumix");

  assert.equal(study.slug, "qrumix");
  assert.ok(project);

  assert.equal(project.caseStudySlug, "qrumix");
});

test("QRumiX case study uses canonical technology IDs", () => {
  const study = getQrumixStudy();
  const project = getProjectById("qrumix");

  assert.deepEqual(study.technologies, project.technologies);

  for (const technologyId of study.technologies) {
    assert.ok(
      getTechnology(technologyId),
      `Unknown technology: ${technologyId}`,
    );
  }
});

test("QRumiX case study includes approved bilingual content", () => {
  const study = getQrumixStudy();

  const requiredFields = [
    "title",
    "summary",
    "role",
    "challenge",
    "solution",
    "architecture",
    "results",
  ];

  for (const field of requiredFields) {
    assertBilingualText(study[field], field);
  }
});

test("QRumiX gallery contains six approved screenshots with accessible descriptions", () => {
  const study = getQrumixStudy();

  assert.ok(Array.isArray(study.gallery));
  assert.equal(study.gallery.length, 6);

  const sources = new Set();

  for (const image of study.gallery) {
    assert.equal(typeof image.src, "string");

    assert.match(image.src, /^\/projects\/qrumix\/[\w.-]+\.(webp|png|jpe?g)$/i);

    assert.ok(!sources.has(image.src), `Duplicate screenshot: ${image.src}`);

    sources.add(image.src);

    if (typeof image.alt === "string") {
      assert.ok(image.alt.trim().length > 0);
    } else {
      assertBilingualText(image.alt, "gallery.alt");
    }
  }
});

test("QRumiX exposes only the approved public updates repository", () => {
  const study = getQrumixStudy();
  const project = getProjectById("qrumix");

  assert.equal(project.isPrivate, true);
  assert.equal(project.repository, null);

  assert.ok(Array.isArray(study.links));

  assert.deepEqual(
    study.links.map((link) => link.url),
    [APPROVED_UPDATES_URL],
  );

  for (const link of study.links) {
    assertBilingualText(link.label, "links.label");
  }
});
