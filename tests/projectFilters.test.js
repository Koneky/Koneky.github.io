
import test from "node:test";
import assert from "node:assert/strict";

import { projects } from "../src/data/projects.js";

import {
  getTechnologyFilter,
  filterProjectsByTechnology,
  hasProjectsForTechnology,
  clearTechnologyFilter,
} from "../src/utils/projectFilters.js";

test("getTechnologyFilter reads a canonical technology ID", () => {
  assert.equal(
    getTechnologyFilter("?tech=react"),
    "react",
  );

  assert.equal(
    getTechnologyFilter("?tech=python"),
    "python",
  );
});

test("getTechnologyFilter ignores unknown technologies", () => {
  assert.equal(
    getTechnologyFilter("?tech=abracadabra"),
    null,
  );

  assert.equal(
    getTechnologyFilter("?tech="),
    null,
  );

  assert.equal(
    getTechnologyFilter(""),
    null,
  );
});

test("getTechnologyFilter preserves query coexistence", () => {
  assert.equal(
    getTechnologyFilter("?season=winter&tech=react"),
    "react",
  );

  assert.equal(
    getTechnologyFilter("?foo=bar&tech=python"),
    "python",
  );
});

test("getTechnologyFilter does not parse hash as technology ID", () => {
  assert.equal(
    getTechnologyFilter("?tech=react#projects"),
    "react",
  );
});

test("filterProjectsByTechnology returns only matching projects", () => {
  const result = filterProjectsByTechnology(
    projects,
    "react",
  );

  assert.deepEqual(
    result.map((project) => project.id),
    [
      "productConfigurator",
      "legacyModernization",
    ],
  );
});

test("filterProjectsByTechnology supports different technologies", () => {
  const result = filterProjectsByTechnology(
    projects,
    "flutter",
  );

  assert.deepEqual(
    result.map((project) => project.id),
    ["qrumix"],
  );
});

test("filterProjectsByTechnology returns all projects without filter", () => {
  const result = filterProjectsByTechnology(
    projects,
    null,
  );

  assert.deepEqual(result, projects);
});

test("filterProjectsByTechnology handles no matches safely", () => {
  assert.deepEqual(
    filterProjectsByTechnology(projects, "fastapi"),
    [],
  );

  assert.deepEqual(
    filterProjectsByTechnology(projects, "abracadabra"),
    [],
  );
});

test("hasProjectsForTechnology identifies useful stack items", () => {
  assert.equal(
    hasProjectsForTechnology(projects, "react"),
    true,
  );

  assert.equal(
    hasProjectsForTechnology(projects, "flutter"),
    true,
  );

  assert.equal(
    hasProjectsForTechnology(projects, "fastapi"),
    false,
  );

  assert.equal(
    hasProjectsForTechnology(projects, "abracadabra"),
    false,
  );
});

test("clearTechnologyFilter removes only tech parameter", () => {
  assert.equal(
    clearTechnologyFilter("?tech=react"),
    "",
  );

  assert.equal(
    clearTechnologyFilter(
      "?season=winter&tech=react&foo=bar",
    ),
    "?season=winter&foo=bar",
  );

  assert.equal(
    clearTechnologyFilter("?season=winter"),
    "?season=winter",
  );
});
