export const staticRoutes = [
  {
    path: "/privacy",
    title: "Privacy | Qarumi",
    description:
      "Privacy information and analytics preferences for the Qarumi portfolio.",
    robots: "index,follow",
  },
  {
    path: "/projects/qrumix",
    title: "QRumiX — Flutter Android Case Study | Qarumi",
    description:
      "QRumiX is an independent Flutter Android project in alpha development, featuring QR-code generation, local data storage, and a GitHub-based update system.",
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
