import test from "node:test";
import assert from "node:assert/strict";

import {
  CONSENT_STORAGE_KEY,
  normalizeConsent,
  readConsent,
  writeConsent,
} from "../src/utils/consent.js";

function createStorage(initialValue = null) {
  const values = new Map();

  if (initialValue !== null) {
    values.set(CONSENT_STORAGE_KEY, initialValue);
  }

  return {
    getItem(key) {
      return values.get(key) ?? null;
    },

    setItem(key, value) {
      values.set(key, value);
    },

    removeItem(key) {
      values.delete(key);
    },
  };
}

test("consent uses the expected storage key", () => {
  assert.equal(CONSENT_STORAGE_KEY, "qarumi-consent-v1");
});

test("readConsent returns null when consent is undecided", () => {
  const storage = createStorage();

  assert.equal(readConsent(storage), null);
});

test("readConsent returns null for invalid stored JSON", () => {
  const storage = createStorage("{not-valid-json");

  assert.equal(readConsent(storage), null);
});

test("normalizeConsent rejects all optional consent", () => {
  assert.deepEqual(
    normalizeConsent({
      version: 1,
      analytics: false,
      behaviorAnalytics: false,
    }),
    {
      version: 1,
      analytics: false,
      behaviorAnalytics: false,
    },
  );
});

test("normalizeConsent accepts all optional consent", () => {
  assert.deepEqual(
    normalizeConsent({
      version: 1,
      analytics: true,
      behaviorAnalytics: true,
    }),
    {
      version: 1,
      analytics: true,
      behaviorAnalytics: true,
    },
  );
});

test("behavior analytics is disabled when analytics is disabled", () => {
  assert.deepEqual(
    normalizeConsent({
      version: 1,
      analytics: false,
      behaviorAnalytics: true,
    }),
    {
      version: 1,
      analytics: false,
      behaviorAnalytics: false,
    },
  );
});

test("normalizeConsent ignores unknown fields", () => {
  assert.deepEqual(
    normalizeConsent({
      version: 1,
      analytics: true,
      behaviorAnalytics: false,
      unexpected: "value",
    }),
    {
      version: 1,
      analytics: true,
      behaviorAnalytics: false,
    },
  );
});

test("writeConsent stores normalized consent", () => {
  const storage = createStorage();

  const consent = writeConsent(
    {
      version: 1,
      analytics: false,
      behaviorAnalytics: true,
    },
    storage,
  );

  assert.deepEqual(consent, {
    version: 1,
    analytics: false,
    behaviorAnalytics: false,
  });

  assert.deepEqual(readConsent(storage), consent);
});
