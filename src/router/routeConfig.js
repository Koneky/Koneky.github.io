export const routePaths = {
  home: "/",
  lab: "/lab",
  resume: "/resume",
  privacy: "/privacy",

  project(slug) {
    return `/projects/${slug}`;
  },

  labExperiment(slug) {
    return `/lab/${slug}`;
  },
};

const knownTopLevelRoutes = new Set([
  routePaths.home,
  routePaths.lab,
  routePaths.resume,
  routePaths.privacy,
]);

export function isKnownTopLevelRoute(pathname) {
  return knownTopLevelRoutes.has(pathname);
}
