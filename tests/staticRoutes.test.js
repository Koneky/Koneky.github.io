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

test("QRumiX case study has a public static route", () => {
  const route = staticRoutes.find((item) => item.path === "/projects/qrumix");

  assert.ok(route, "QRumiX must have a static route");

  assert.equal(route.robots, "index,follow");

  assert.equal(typeof route.title, "string");
  assert.match(route.title, /qrumix/i);

  assert.equal(typeof route.description, "string");
  assert.ok(route.description.trim().length > 0);

  assert.doesNotThrow(() => {
    validateStaticRoutes(staticRoutes);
  });
});
