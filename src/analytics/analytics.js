const unsafeFreeFormFields = new Set([
  "searchText",
  "searchQuery",
  "terminalInput",
  "terminalText",
  "commandText",
]);

function normalizePathname(value) {
  if (typeof value !== "string") {
    return "/";
  }

  const withoutHash = value.split("#", 1)[0];
  const withoutQuery = withoutHash.split("?", 1)[0];

  return withoutQuery || "/";
}

export function normalizeAnalyticsEvent(
  name,
  params = {},
) {
  if (
    typeof name !== "string"
    || name.trim().length === 0
  ) {
    throw new Error(
      "Analytics event name must be a non-empty string",
    );
  }

  if (
    params === null
    || typeof params !== "object"
    || Array.isArray(params)
  ) {
    throw new Error(
      "Analytics event params must be an object",
    );
  }

  for (const key of Object.keys(params)) {
    if (unsafeFreeFormFields.has(key)) {
      throw new Error(
        `Unsafe free-form analytics field: ${key}`,
      );
    }
  }

  return {
    name: name.trim(),
    params: {
      ...params,
    },
  };
}

export function createAnalyticsClient({
  getConsent,
  adapters = [],
} = {}) {
  function canTrack() {
    if (typeof getConsent !== "function") {
      return false;
    }

    try {
      return getConsent()?.analytics === true;
    } catch {
      return false;
    }
  }

  function trackEvent(name, params = {}) {
    if (!canTrack()) {
      return false;
    }

    const event = normalizeAnalyticsEvent(
      name,
      params,
    );

    for (const adapter of adapters) {
      try {
        adapter.trackEvent?.(
          event.name,
          event.params,
        );
      } catch {
        // Analytics must never break the portfolio.
      }
    }

    return true;
  }

  function trackPageView(pathname) {
    if (!canTrack()) {
      return false;
    }

    const normalizedPathname =
      normalizePathname(pathname);

    for (const adapter of adapters) {
      try {
        adapter.trackPageView?.(
          normalizedPathname,
        );
      } catch {
        // Analytics must never break the portfolio.
      }
    }

    return true;
  }

  return {
    trackEvent,
    trackPageView,
  };
}

let activeAnalyticsClient = null;

export function setAnalyticsClient(client) {
  activeAnalyticsClient = client ?? null;
}

export function trackEvent(
  name,
  params = {},
) {
  if (
    activeAnalyticsClient === null
    || typeof activeAnalyticsClient.trackEvent
      !== "function"
  ) {
    return false;
  }

  return activeAnalyticsClient.trackEvent(
    name,
    params,
  );
}

export function trackPageView(pathname) {
  if (
    activeAnalyticsClient === null
    || typeof activeAnalyticsClient.trackPageView
      !== "function"
  ) {
    return false;
  }

  return activeAnalyticsClient.trackPageView(
    pathname,
  );
}

export function shouldReloadForAnalyticsRevocation(
  previousConsent,
  nextConsent,
) {
  const analyticsRevoked =
    previousConsent?.analytics === true
    && nextConsent?.analytics !== true;

  const behaviorAnalyticsRevoked =
    previousConsent?.behaviorAnalytics === true
    && nextConsent?.behaviorAnalytics !== true;

  return (
    analyticsRevoked
    || behaviorAnalyticsRevoked
  );
}

export function shouldReloadForAnalyticsProviderChange(
  previousConsent,
  nextConsent,
  {
    googleEnabled = false,
    yandexEnabled = false,
  } = {},
) {
  const analyticsWasActive =
    previousConsent?.analytics === true;

  const analyticsRevoked =
    analyticsWasActive
    && nextConsent?.analytics !== true
    && (
      googleEnabled
      || yandexEnabled
    );

  const yandexBehaviorModeChanged =
    yandexEnabled
    && analyticsWasActive
    && nextConsent?.analytics === true
    && (
      previousConsent?.behaviorAnalytics
      !== nextConsent?.behaviorAnalytics
    );

  return (
    analyticsRevoked
    || yandexBehaviorModeChanged
  );
}

export function shouldTrackProviderPageView({
  enabled = false,
  initialized = false,
  pathname,
  lastPathname = null,
} = {}) {
  return (
    enabled === true &&
    initialized === true &&
    typeof pathname === "string" &&
    pathname.length > 0 &&
    pathname !== lastPathname
  );
}

export function getFirstPartyAnalyticsCookieNames(
  cookieString = "",
) {
  if (typeof cookieString !== "string") {
    return [];
  }

  return cookieString
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.split("=", 1)[0])
    .filter((name) => (
      name === "_ga"
      || name.startsWith("_ga_")
      || name === "_gid"
      || name === "_gat"
      || name.startsWith("_ym_")
    ));
}

export function clearFirstPartyAnalyticsCookies(
  documentLike,
) {
  if (!documentLike) {
    return 0;
  }

  let cookieString;

  try {
    cookieString = documentLike.cookie;
  } catch {
    return 0;
  }

  const cookieNames =
    getFirstPartyAnalyticsCookieNames(
      cookieString,
    );

  let cleared = 0;

  for (const name of cookieNames) {
    try {
      documentLike.cookie =
        `${name}=; Max-Age=0; Path=/`;

      cleared += 1;
    } catch {
      // Cookie cleanup must never break the app.
    }
  }

  return cleared;
}

export function shouldClearFirstPartyAnalyticsCookies(
  previousConsent,
  nextConsent,
) {
  return (
    previousConsent?.analytics === true
    && nextConsent?.analytics !== true
  );
}

export function shouldEnsureAnalyticsCookiesCleared(
  consent,
) {
  return consent?.analytics === false;
}
