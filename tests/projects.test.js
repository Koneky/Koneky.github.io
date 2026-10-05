import test from "node:test";
import assert from "node:assert/strict";

import { projects, getProjectById } from "../src/data/projects.js";

test("every project has a unique ID", () => {
  const projectIds = projects.map((project) => project.id);

  assert.equal(
    new Set(projectIds).size,
    projectIds.length,
    "Project IDs must be unique",
  );
});

test("getProjectById returns QRumiX", () => {
  const project = getProjectById("qrumix");

  assert.ok(project);
  assert.equal(project.id, "qrumix");
  assert.equal(project.title, "QRumiX");
});

test("getProjectById returns null for an unknown project", () => {
  assert.equal(getProjectById("not-real"), null);
});
