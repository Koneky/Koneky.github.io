import { routePaths } from "../router/routeConfig.js";

export function getHomeSectionTarget(
  sectionId,
  options = {},
) {
  const params = new URLSearchParams();

  if (options.tech) {
    params.set("tech", options.tech);
  }

  const query = params.toString();
  const hash = `#${sectionId}`;

  return query
    ? `${routePaths.home}?${query}${hash}`
    : `${routePaths.home}${hash}`;
}
