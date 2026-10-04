import { useEffect } from "react";
import {
  useLocation,
  useNavigationType,
} from "react-router-dom";

function RouteScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (location.hash) {
      const sectionId = decodeURIComponent(
        location.hash.slice(1),
      );

      const frameId = window.requestAnimationFrame(() => {
        const target = document.getElementById(sectionId);

        if (!target) {
          return;
        }

        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
        });
      });

      return () => {
        window.cancelAnimationFrame(frameId);
      };
    }

    if (navigationType !== "POP") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }
  }, [
    location.pathname,
    location.hash,
    navigationType,
  ]);

  return null;
}

export default RouteScrollManager;
