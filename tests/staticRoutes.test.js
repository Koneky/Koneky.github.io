import test from "node:test";
import assert from "node:assert/strict";

import {
  staticRoutes,
  validateStaticRoutes,
} from "../src/data/staticRoutes.js";

test("static route registry includes the privacy page", () => {
  const privacyRoute = staticRoutes.find((route) => route.path === "/privacy");

  assert.ok(privacyRoute);

  assert.equal(typeof privacyRoute.title, "string");
  assert.equal(typeof privacyRoute.description, "string");
  assert.equal(privacyRoute.robots, "index,follow");

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
