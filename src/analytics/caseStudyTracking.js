import {
  getCaseStudyBySlug,
} from "../data/caseStudies/index.js";

import {
  trackEvent,
} from "./analytics.js";

/**
 * Tracks the opening of a registered case study.
 *
 * Only stable, registered slugs are allowed.
 * Consent gating is handled by the analytics client.
 */
export function trackCaseStudyOpen(
  slug,
  track = trackEvent,
) {
  if (
    typeof slug !== "string" ||
    !getCaseStudyBySlug(slug)
  ) {
    return false;
  }

  if (typeof track !== "function") {
    return false;
  }

  return track("project_case_study_open", {
    slug,
  });
}
