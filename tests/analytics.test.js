import test from "node:test";
import assert from "node:assert/strict";

import {
  getAnalyticsConfig,
} from "../src/analytics/config.js";

import {
  createAnalyticsClient,
  normalizeAnalyticsEvent,
  shouldReloadForAnalyticsRevocation,
  shouldReloadForAnalyticsProviderChange,
  trackEvent,
  trackPageView,
  shouldTrackProviderPageView,
  getFirstPartyAnalyticsCookieNames,
  clearFirstPartyAnalyticsCookies,
  shouldClearFirstPartyAnalyticsCookies,
  shouldEnsureAnalyticsCookiesCleared,
} from "../src/analytics/analytics.js";

test("missing analytics IDs disable providers safely", () => {
  const config = getAnalyticsConfig({
    DEV: false,
    VITE_GA_ID: "",
    VITE_YM_ID: "",
  });

  assert.equal(config.google.enabled, false);
  assert.equal(config.google.id, null);

  assert.equal(config.yandex.enabled, false);
  assert.equal(config.yandex.id, null);
});

test("development mode disables analytics providers even when IDs exist", () => {
  const config = getAnalyticsConfig({
    DEV: true,
    VITE_GA_ID: "G-TEST123",
    VITE_YM_ID: "12345678",
  });

  assert.equal(config.google.enabled, false);
  assert.equal(config.yandex.enabled, false);
});

test("event normalization rejects arbitrary free-form search or terminal text", () => {
  assert.throws(
    () => {
      normalizeAnalyticsEvent("command_search", {
        searchText: "some arbitrary visitor text",
      });
    },
    /free-form|unsafe/i,
  );

  assert.throws(
    () => {
      normalizeAnalyticsEvent("terminal_submit", {
        terminalInput: "some arbitrary terminal input",
      });
    },
    /free-form|unsafe/i,
  );
});

test("page-view tracking strips query and hash values", () => {
  const pageViews = [];

  const client = createAnalyticsClient({
    getConsent: () => ({
      analytics: true,
      behaviorAnalytics: false,
    }),

    adapters: [
      {
        trackPageView(pathname) {
          pageViews.push(pathname);
        },
      },
    ],
  });

  client.trackPageView(
    "/privacy?search=private-value#analytics",
  );

  assert.deepEqual(pageViews, ["/privacy"]);
});

test("analytics adapters receive nothing without analytics consent", () => {
  const calls = [];

  const client = createAnalyticsClient({
    getConsent: () => ({
      analytics: false,
      behaviorAnalytics: false,
    }),

    adapters: [
      {
        trackEvent(name, params) {
          calls.push({
            type: "event",
            name,
            params,
          });
        },

        trackPageView(pathname) {
          calls.push({
            type: "page_view",
            pathname,
          });
        },
      },
    ],
  });

  client.trackEvent("contact_open", {
    source: "footer",
  });

  client.trackPageView("/privacy");

  assert.deepEqual(calls, []);
});

test("analytics revocation requires a reload only when an active category is disabled", () => {
  assert.equal(
    shouldReloadForAnalyticsRevocation(
      {
        analytics: true,
        behaviorAnalytics: true,
      },
      {
        analytics: false,
        behaviorAnalytics: false,
      },
    ),
    true,
  );

  assert.equal(
    shouldReloadForAnalyticsRevocation(
      {
        analytics: true,
        behaviorAnalytics: true,
      },
      {
        analytics: true,
        behaviorAnalytics: false,
      },
    ),
    true,
  );

  assert.equal(
    shouldReloadForAnalyticsRevocation(
      {
        analytics: false,
        behaviorAnalytics: false,
      },
      {
        analytics: true,
        behaviorAnalytics: false,
      },
    ),
    false,
  );

  assert.equal(
    shouldReloadForAnalyticsRevocation(
      {
        analytics: true,
        behaviorAnalytics: false,
      },
      {
        analytics: true,
        behaviorAnalytics: false,
      },
    ),
    false,
  );
});

test("provider-aware consent changes reload only when an initialized provider needs it", () => {
  const allEnabled = {
    googleEnabled: true,
    yandexEnabled: true,
  };

  assert.equal(
    shouldReloadForAnalyticsProviderChange(
      {
        analytics: true,
        behaviorAnalytics: false,
      },
      {
        analytics: false,
        behaviorAnalytics: false,
      },
      allEnabled,
    ),
    true,
  );

  assert.equal(
    shouldReloadForAnalyticsProviderChange(
      {
        analytics: true,
        behaviorAnalytics: false,
      },
      {
        analytics: true,
        behaviorAnalytics: true,
      },
      allEnabled,
    ),
    true,
  );

  assert.equal(
    shouldReloadForAnalyticsProviderChange(
      {
        analytics: true,
        behaviorAnalytics: true,
      },
      {
        analytics: true,
        behaviorAnalytics: false,
      },
      allEnabled,
    ),
    true,
  );

  assert.equal(
    shouldReloadForAnalyticsProviderChange(
      {
        analytics: false,
        behaviorAnalytics: false,
      },
      {
        analytics: true,
        behaviorAnalytics: true,
      },
      allEnabled,
    ),
    false,
  );

  assert.equal(
    shouldReloadForAnalyticsProviderChange(
      {
        analytics: true,
        behaviorAnalytics: false,
      },
      {
        analytics: true,
        behaviorAnalytics: true,
      },
      {
        googleEnabled: true,
        yandexEnabled: false,
      },
    ),
    false,
  );

  assert.equal(
    shouldReloadForAnalyticsProviderChange(
      {
        analytics: true,
        behaviorAnalytics: true,
      },
      {
        analytics: false,
        behaviorAnalytics: false,
      },
      {
        googleEnabled: false,
        yandexEnabled: false,
      },
    ),
    false,
  );
});

test("public analytics tracking helpers are safe before provider initialization", () => {
  assert.equal(
    trackEvent("contact_open", {
      source: "footer",
    }),
    false,
  );

  assert.equal(
    trackPageView(
      "/privacy?search=private-value#analytics",
    ),
    false,
  );
});

test("provider page views wait for initialization and do not duplicate the same pathname", () => {
  assert.equal(
    shouldTrackProviderPageView({
      enabled: true,
      initialized: false,
      pathname: "/privacy",
      lastPathname: null,
    }),
    false,
  );

  assert.equal(
    shouldTrackProviderPageView({
      enabled: true,
      initialized: true,
      pathname: "/privacy",
      lastPathname: null,
    }),
    true,
  );

  assert.equal(
    shouldTrackProviderPageView({
      enabled: true,
      initialized: true,
      pathname: "/privacy",
      lastPathname: "/privacy",
    }),
    false,
  );

  assert.equal(
    shouldTrackProviderPageView({
      enabled: true,
      initialized: true,
      pathname: "/projects/qrumix",
      lastPathname: "/privacy",
    }),
    true,
  );

  assert.equal(
    shouldTrackProviderPageView({
      enabled: false,
      initialized: true,
      pathname: "/privacy",
      lastPathname: null,
    }),
    false,
  );
});

test("analytics cookie cleanup targets only identifiable first-party analytics cookies", () => {
  const names =
    getFirstPartyAnalyticsCookieNames(
      [
        "_ga=GA1.1.123.456",
        "_ga_TEST=GS1.1.123",
        "_gid=123",
        "_gat=1",
        "_ym_uid=123456",
        "_ym_d=123456",
        "_ym_isad=2",
        "theme=dark",
        "session_id=private-session",
      ].join("; "),
    );

  assert.deepEqual(
    names,
    [
      "_ga",
      "_ga_TEST",
      "_gid",
      "_gat",
      "_ym_uid",
      "_ym_d",
      "_ym_isad",
    ],
  );
});

test("analytics cookie cleanup expires only identifiable first-party analytics cookies", () => {
  const writes = [];

  const documentLike = {
    get cookie() {
      return [
        "_ga=GA1.1.123.456",
        "_ym_uid=123456",
        "theme=dark",
      ].join("; ");
    },

    set cookie(value) {
      writes.push(value);
    },
  };

  const cleared =
    clearFirstPartyAnalyticsCookies(
      documentLike,
    );

  assert.equal(cleared, 2);

  assert.deepEqual(
    writes,
    [
      "_ga=; Max-Age=0; Path=/",
      "_ym_uid=; Max-Age=0; Path=/",
    ],
  );
});

test("analytics cookies are cleared only when analytics consent itself is revoked", () => {
  assert.equal(
    shouldClearFirstPartyAnalyticsCookies(
      {
        analytics: true,
        behaviorAnalytics: true,
      },
      {
        analytics: false,
        behaviorAnalytics: false,
      },
    ),
    true,
  );

  assert.equal(
    shouldClearFirstPartyAnalyticsCookies(
      {
        analytics: true,
        behaviorAnalytics: true,
      },
      {
        analytics: true,
        behaviorAnalytics: false,
      },
    ),
    false,
  );

  assert.equal(
    shouldClearFirstPartyAnalyticsCookies(
      {
        analytics: true,
        behaviorAnalytics: false,
      },
      {
        analytics: true,
        behaviorAnalytics: true,
      },
    ),
    false,
  );

  assert.equal(
    shouldClearFirstPartyAnalyticsCookies(
      {
        analytics: false,
        behaviorAnalytics: false,
      },
      {
        analytics: false,
        behaviorAnalytics: false,
      },
    ),
    false,
  );
});

test("analytics cookies are cleaned on load when stored analytics consent is disabled", () => {
  assert.equal(
    shouldEnsureAnalyticsCookiesCleared({
      analytics: false,
      behaviorAnalytics: false,
    }),
    true,
  );

  assert.equal(
    shouldEnsureAnalyticsCookiesCleared({
      analytics: true,
      behaviorAnalytics: false,
    }),
    false,
  );

  assert.equal(
    shouldEnsureAnalyticsCookiesCleared(null),
    false,
  );
});
