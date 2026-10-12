function normalizeId(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

export function getAnalyticsConfig(env = {}) {
  const development = env.DEV === true;

  const googleId = normalizeId(
    env.VITE_GA_ID,
  );

  const yandexId = normalizeId(
    env.VITE_YM_ID,
  );

  return {
    google: {
      id: googleId,
      enabled: !development && googleId !== null,
    },

    yandex: {
      id: yandexId,
      enabled: !development && yandexId !== null,
    },
  };
}
