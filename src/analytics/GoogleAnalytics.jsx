import {
  useEffect,
  useRef,
} from "react";

import {
  shouldTrackProviderPageView,
} from "./analytics";

export default function GoogleAnalytics({
  measurementId,
  enabled,
  pathname,
}) {
  const initializedRef = useRef(false);
  const lastPathnameRef = useRef(null);

  useEffect(() => {
    if (
      !enabled
      || !measurementId
      || typeof document === "undefined"
      || typeof window === "undefined"
    ) {
      return undefined;
    }

    const scriptId =
      "qarumi-google-analytics";

    if (!initializedRef.current) {
      window.dataLayer =
        window.dataLayer || [];

      window.gtag =
        window.gtag
        || function gtag() {
          window.dataLayer.push(arguments);
        };

      window.gtag("js", new Date());

      window.gtag(
        "config",
        measurementId,
        {
          send_page_view: false,
        },
      );

      if (!document.getElementById(scriptId)) {
        const script =
          document.createElement("script");

        script.id = scriptId;
        script.async = true;
        script.src =
          `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
            measurementId,
          )}`;

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
      window.gtag(
        "event",
        "page_view",
        {
          page_path: pathname,
        },
      );

      lastPathnameRef.current = pathname;
    }

    return undefined;
  }, [
    enabled,
    measurementId,
    pathname,
  ]);

  return null;
}
