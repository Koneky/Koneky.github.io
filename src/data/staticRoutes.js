export const staticRoutes = [];

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
