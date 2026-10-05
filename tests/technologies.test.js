import test from "node:test";
import assert from "node:assert/strict";

import {
  technologies,
  technologyGroups,
  getTechnology,
} from "../src/data/technologies.js";
import { projects } from "../src/data/projects.js";

test("every project technology references a known technology", () => {
  for (const project of projects) {
    for (const technologyId of project.technologies) {
      assert.ok(
        technologies[technologyId],
        `Project "${project.id}" references unknown technology "${technologyId}"`,
      );
    }
  }
});

test("every technology group entry references a known technology", () => {
  for (const group of technologyGroups) {
    for (const technologyId of group.technologies) {
      assert.ok(
        technologies[technologyId],
        `Technology group "${group.key}" references unknown technology "${technologyId}"`,
      );
    }
  }
});

test("getTechnology returns null for an unknown technology", () => {
  assert.equal(getTechnology("not-real"), null);
});
