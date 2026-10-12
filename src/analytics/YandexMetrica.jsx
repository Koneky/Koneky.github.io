import {
  useEffect,
  useRef,
} from "react";

import {
  shouldTrackProviderPageView,
} from "./analytics";

export default function YandexMetrica({
  counterId,
  enabled,
  behaviorAnalytics,
  pathname,
}) {
  const initializedRef = useRef(false);
const lastPathnameRef = useRef(null);

  useEffect(() => {
    if (
      !enabled
      || !counterId
      || typeof document === "undefined"
      || typeof window === "undefined"
    ) {
      return undefined;
    }

    const numericCounterId =
      Number(counterId);

    if (!Number.isFinite(numericCounterId)) {
      return undefined;
    }

    const scriptId =
      "qarumi-yandex-metrica";

    if (!initializedRef.current) {
      window.ym =
        window.ym
        || function ym() {
          window.ym.a =
            window.ym.a || [];

          window.ym.a.push(arguments);
        };

      window.ym.l =
        window.ym.l || Date.now();

      window.ym(
        numericCounterId,
        "init",
        {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor:
            behaviorAnalytics === true,
        },
      );

      if (!document.getElementById(scriptId)) {
        const script =
          document.createElement("script");

        script.id = scriptId;
        script.async = true;
        script.src =
          "https://mc.yandex.ru/metrika/tag.js";

        document.head.appendChild(script);
      }

      initializedRef.current = true;
    }

    const shouldTrack =
      shouldTrackProviderPageView({
        enabled,
        initialized:
          initializedRef.current,
        pathname,
        lastPathname:
          lastPathnameRef.current,
      });

    if (shouldTrack) {
      window.ym(
        numericCounterId,
        "hit",
        pathname,
      );

      lastPathnameRef.current = pathname;
    }

    return undefined;
  }, [
    behaviorAnalytics,
    counterId,
    enabled,
    pathname,
  ]);

  return null;
}
