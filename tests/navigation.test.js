import test from "node:test";
import assert from "node:assert/strict";

import { getHomeSectionTarget } from "../src/utils/navigation.js";

test("getHomeSectionTarget builds homepage section target", () => {
  assert.equal(getHomeSectionTarget("about"), "/#about");
});

test("getHomeSectionTarget places query before hash", () => {
  assert.equal(
    getHomeSectionTarget("projects", {
      tech: "react",
    }),
    "/?tech=react#projects",
  );
});

test("getHomeSectionTarget omits empty optional query", () => {
  assert.equal(getHomeSectionTarget("projects"), "/#projects");

  assert.equal(
    getHomeSectionTarget("projects", {
      tech: undefined,
    }),
    "/#projects",
  );

  assert.equal(
    getHomeSectionTarget("projects", {
      tech: "",
    }),
    "/#projects",
  );
});
