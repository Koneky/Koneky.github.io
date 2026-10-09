export const CONSENT_STORAGE_KEY = "qarumi-consent-v1";

export function normalizeConsent(value = {}) {
  const analytics = value.analytics === true;

  return {
    version: 1,
    analytics,
    behaviorAnalytics: analytics && value.behaviorAnalytics === true,
  };
}

export function readConsent(storage) {
  if (!storage) {
    return null;
  }

  const storedValue = storage.getItem(CONSENT_STORAGE_KEY);

  if (storedValue === null) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    return normalizeConsent(parsedValue);
  } catch {
    return null;
  }
}

export function writeConsent(value, storage) {
  const normalizedConsent = normalizeConsent(value);

  storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(normalizedConsent));

  return normalizedConsent;
}
