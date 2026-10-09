export const staticRoutes = [
  {
    path: "/privacy",
    title: "Privacy | Qarumi",
    description: "Privacy information and analytics preferences for thr Qarumi portfolio.",
    robots: "index,follow",
  },
];

export function validateStaticRoutes(routes) {
  const paths = new Set();

  routes.forEach((route) => {
    if (paths.has(route.path)) {
      throw new Error(
        `Duplicate static route path: ${route.path}`,
      );
    }

    paths.add(route.path);
  });

  return true;
}
