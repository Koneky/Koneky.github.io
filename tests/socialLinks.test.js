import test from "node:test";
import assert from "node:assert/strict";

import {
  socialLinks,
  getSocialLinksFor,
} from "../src/data/socialLinks.js";

test("every social link has a unique ID", () => {
  const ids = socialLinks.map((link) => link.id);

  assert.equal(
    new Set(ids).size,
    ids.length,
    "Social link IDs must be unique",
  );
});

test("GitHub is present with the canonical profile URL", () => {
  const github = socialLinks.find((link) => link.id === "github");

  assert.ok(github);
  assert.equal(github.href, "https://github.com/Koneky");
  assert.equal(github.kind, "external");
});

test("social links expose explicit surface flags", () => {
  const surfaceFlags = [
    "showInContact",
    "showInFooter",
    "showInResume",
    "showInCommands",
  ];

  for (const link of socialLinks) {
    for (const flag of surfaceFlags) {
      assert.equal(
        typeof link[flag],
        "boolean",
        `"${link.id}" must define ${flag}`,
      );
    }
  }
});

test("getSocialLinksFor respects surface flags", () => {
  const surfaces = {
    contact: "showInContact",
    footer: "showInFooter",
    resume: "showInResume",
    commands: "showInCommands",
  };

  for (const [surface, flag] of Object.entries(surfaces)) {
    const result = getSocialLinksFor(surface);

    assert.deepEqual(
      result.map((link) => link.id),
      socialLinks
        .filter((link) => link[flag])
        .map((link) => link.id),
    );
  }
});

test("external links and email actions have distinguishable kinds", () => {
  for (const link of socialLinks) {
    assert.ok(
      link.kind === "external" || link.kind === "email",
      `"${link.id}" has unsupported kind "${link.kind}"`,
    );

    if (link.kind === "external") {
      assert.equal(
        link.href.startsWith("mailto:"),
        false,
        `"${link.id}" is external but uses mailto`,
      );
    }

    if (link.kind === "email") {
      assert.equal(
        link.href.startsWith("mailto:"),
        true,
        `"${link.id}" is email but does not use mailto`,
      );
    }
  }
});
