import test from "node:test";
import assert from "node:assert/strict";

import { copyText } from "../src/utils/clipboard.js";

test("copyText delegates to navigator.clipboard.writeText", async () => {
  const originalNavigator = globalThis.navigator;
  let copiedText = null;

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      clipboard: {
        async writeText(text) {
          copiedText = text;
        },
      },
    },
  });

  try {
    await copyText("qarumik@gmail.com");

    assert.equal(copiedText, "qarumik@gmail.com");
  } finally {
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: originalNavigator,
    });
  }
});

test("copyText rejects safely when clipboard API is unavailable", async () => {
  const originalNavigator = globalThis.navigator;

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {},
  });

  try {
    await assert.rejects(copyText("qarumik@gmail.com"), /clipboard/i);
  } finally {
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: originalNavigator,
    });
  }
});
