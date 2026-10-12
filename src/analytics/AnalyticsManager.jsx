import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { useConsent } from "../context/useConsent";
import {
  clearFirstPartyAnalyticsCookies,
  createAnalyticsClient,
  setAnalyticsClient,
  shouldClearFirstPartyAnalyticsCookies,
  shouldReloadForAnalyticsProviderChange,
  shouldEnsureAnalyticsCookiesCleared,
} from "./analytics";
import { getAnalyticsConfig } from "./config";
import GoogleAnalytics from "./GoogleAnalytics";
import YandexMetrica from "./YandexMetrica";

export default function AnalyticsManager() {
  const location = useLocation();
  const { consent } = useConsent();

  const config = getAnalyticsConfig(
    import.meta.env,
  );

  const consentRef = useRef(consent);
  const previousConsentRef = useRef(consent);

  useEffect(() => {
    consentRef.current = consent;
  }, [consent]);

  useEffect(() => {
    if (
      !shouldEnsureAnalyticsCookiesCleared(
        consent,
      )
      || typeof document === "undefined"
    ) {
      return;
    }

    clearFirstPartyAnalyticsCookies(
      document,
    );
  }, [consent]);

  useEffect(() => {
    const previousConsent =
      previousConsentRef.current;

    previousConsentRef.current = consent;

    if (
      previousConsent === null
      || consent === null
    ) {
      return;
    }

    const shouldClearCookies =
      shouldClearFirstPartyAnalyticsCookies(
        previousConsent,
        consent,
      );

    if (
      shouldClearCookies
      && typeof document !== "undefined"
    ) {
      clearFirstPartyAnalyticsCookies(
        document,
      );
    }

    const shouldReload =
      shouldReloadForAnalyticsProviderChange(
        previousConsent,
        consent,
        {
          googleEnabled:
            config.google.enabled,
          yandexEnabled:
            config.yandex.enabled,
        },
      );

    if (
      shouldReload
      && typeof window !== "undefined"
    ) {
      window.location.reload();
    }
  }, [
    consent,
    config.google.enabled,
    config.yandex.enabled,
  ]);

  const googleEnabled =
    config.google.enabled
    && consent?.analytics === true;

  const yandexEnabled =
    config.yandex.enabled
    && consent?.analytics === true;

  const clientRef = useRef(null);

  if (clientRef.current === null) {
    clientRef.current = createAnalyticsClient({
      getConsent: () => consentRef.current,

      adapters: [
        {
          trackPageView(pathname) {
            if (
              config.google.enabled
              && typeof window.gtag === "function"
            ) {
              window.gtag(
                "event",
                "page_view",
                {
                  page_path: pathname,
                },
              );
            }

            if (
              config.yandex.enabled
              && typeof window.ym === "function"
            ) {
              const counterId = Number(
                config.yandex.id,
              );

              if (Number.isFinite(counterId)) {
                window.ym(
                  counterId,
                  "hit",
                  pathname,
                );
              }
            }
          },

          trackEvent(name, params) {
            if (
              config.google.enabled
              && typeof window.gtag === "function"
            ) {
              window.gtag(
                "event",
                name,
                params,
              );
            }

            if (
              config.yandex.enabled
              && typeof window.ym === "function"
            ) {
              const counterId = Number(
                config.yandex.id,
              );

              if (Number.isFinite(counterId)) {
                window.ym(
                  counterId,
                  "reachGoal",
                  name,
                  params,
                );
              }
            }
          },
        },
      ],
    });
  }

  useEffect(() => {
    setAnalyticsClient(clientRef.current);

    return () => {
      setAnalyticsClient(null);
    };
  }, []);

  return (
    <>
      <GoogleAnalytics
        measurementId={config.google.id}
        enabled={googleEnabled}
        pathname={location.pathname}
      />

      <YandexMetrica
        counterId={config.yandex.id}
        enabled={yandexEnabled}
        behaviorAnalytics={
          consent?.behaviorAnalytics === true
        }
        pathname={location.pathname}
      />
    </>
  );
}
