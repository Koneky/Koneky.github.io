import test from "node:test";
import assert from "node:assert/strict";

import { isKnownTopLevelRoute, routePaths } from "../src/router/routeConfig.js";

test("routePaths exposes known application routes", () => {
  assert.equal(routePaths.home, "/");
  assert.equal(routePaths.lab, "/lab");
  assert.equal(routePaths.resume, "/resume");
  assert.equal(routePaths.privacy, "/privacy");
});

test("routePaths builds project routes", () => {
  assert.equal(routePaths.project("qrumix"), "/projects/qrumix");
});

test("routePaths builds lab experiment routes", () => {
  assert.equal(
    routePaths.labExperiment("particle-field"),
    "/lab/particle-field",
  );
});

test("isKnownTopLevelRoute recognizes only known top-level routes", () => {
  assert.equal(isKnownTopLevelRoute("/"), true);
  assert.equal(isKnownTopLevelRoute("/lab"), true);
  assert.equal(isKnownTopLevelRoute("/resume"), true);
  assert.equal(isKnownTopLevelRoute("/privacy"), true);

  assert.equal(isKnownTopLevelRoute("/projects/qrumix"), false);
  assert.equal(isKnownTopLevelRoute("/lab/particle-field"), false);
  assert.equal(isKnownTopLevelRoute("/not-real"), false);
});
