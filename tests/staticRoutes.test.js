import test from "node:test";
import assert from "node:assert/strict";

import {
  staticRoutes,
  validateStaticRoutes,
} from "../src/data/staticRoutes.js";

test("initial static route registry is valid", () => {
  assert.deepEqual(staticRoutes, []);

  assert.doesNotThrow(() => {
    validateStaticRoutes(staticRoutes);
  });
});

test("static route registry rejects duplicate paths", () => {
  const routes = [
    {
      path: "/privacy",
      title: "Privacy",
      description: "Privacy page",
      robots: "index,follow",
    },
    {
      path: "/privacy",
      title: "Duplicate Privacy",
      description: "Duplicate route",
      robots: "index,follow",
    },
  ];

  assert.throws(() => validateStaticRoutes(routes), /duplicate/i);
});
