import test from "node:test";
import assert from "node:assert/strict";

import {
  createAnalyticsClient,
} from "../src/analytics/analytics.js";

import {
  trackCaseStudyOpen,
} from "../src/analytics/caseStudyTracking.js";

function createHarness(initialConsent) {
  let consent = initialConsent;
  const events = [];

  const client = createAnalyticsClient({
    getConsent: () => consent,

    adapters: [
      {
        trackEvent(name, params) {
          events.push({ name, params });
        },
      },
    ],
  });

  return {
    events,
    track: client.trackEvent,

    setConsent(value) {
      consent = value;
    },
  };
}

test("QRumiX case-study event requires analytics consent", () => {
  const harness = createHarness(null);

  assert.equal(
    trackCaseStudyOpen("qrumix", harness.track),
    false,
  );

  harness.setConsent({
    analytics: false,
    behaviorAnalytics: false,
  });

  assert.equal(
    trackCaseStudyOpen("qrumix", harness.track),
    false,
  );

  assert.deepEqual(harness.events, []);
});

test("QRumiX tracking sends only its stable slug", () => {
  const harness = createHarness({
    analytics: true,
    behaviorAnalytics: false,
  });

  assert.equal(
    trackCaseStudyOpen("qrumix", harness.track),
    true,
  );

  assert.deepEqual(harness.events, [
    {
      name: "project_case_study_open",
      params: {
        slug: "qrumix",
      },
    },
  ]);
});

test("unknown case-study slugs are not tracked", () => {
  const harness = createHarness({
    analytics: true,
    behaviorAnalytics: false,
  });

  for (const slug of [
    "unknown",
    "qrumix?search=private",
    "../qrumix",
    "",
  ]) {
    assert.equal(
      trackCaseStudyOpen(slug, harness.track),
      false,
    );
  }

  assert.deepEqual(harness.events, []);
});
