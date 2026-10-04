import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  staticRoutes,
  validateStaticRoutes,
} from "../src/data/staticRoutes.js";

const SITE_ORIGIN = "https://koneky.github.io";
const DIST_DIR = path.resolve("dist");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceOrInsertMeta(
  html,
  attribute,
  name,
  content,
) {
  if (content === undefined) {
    return html;
  }

  const escapedContent = escapeHtml(content);

  const pattern = new RegExp(
    `<meta\\s+${attribute}=["']${name}["'][\\s\\S]*?>`,
    "i",
  );

  const replacement =
    `<meta ${attribute}="${name}" content="${escapedContent}" />`;

  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html.replace(
    "</head>",
    `    ${replacement}\n  </head>`,
  );
}

function replaceOrInsertCanonical(html, canonical) {
  if (!canonical) {
    return html;
  }

  const escapedCanonical = escapeHtml(canonical);

  const pattern =
    /<link\s+rel=["']canonical["'][\s\S]*?>/i;

  const replacement =
    `<link rel="canonical" href="${escapedCanonical}" />`;

  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html.replace(
    "</head>",
    `    ${replacement}\n  </head>`,
  );
}

export function renderRouteHtml(
  baseHtml,
  metadata = {},
) {
  let html = baseHtml;

  if (metadata.title !== undefined) {
    const escapedTitle = escapeHtml(metadata.title);

    html = html.replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title>${escapedTitle}</title>`,
    );

    html = replaceOrInsertMeta(
      html,
      "property",
      "og:title",
      metadata.title,
    );
  }

  html = replaceOrInsertMeta(
    html,
    "name",
    "description",
    metadata.description,
  );

  html = replaceOrInsertMeta(
    html,
    "property",
    "og:description",
    metadata.description,
  );

  html = replaceOrInsertMeta(
    html,
    "name",
    "robots",
    metadata.robots,
  );

  html = replaceOrInsertMeta(
    html,
    "property",
    "og:url",
    metadata.canonical,
  );

  html = replaceOrInsertCanonical(
    html,
    metadata.canonical,
  );

  return html;
}

export function routeOutputPath(route) {
  if (
    typeof route !== "string" ||
    !route.startsWith("/") ||
    route.includes("\\") ||
    route.includes("?") ||
    route.includes("#")
  ) {
    throw new Error(
      `Invalid route path: ${route}`,
    );
  }

  let decodedRoute;

  try {
    decodedRoute = decodeURIComponent(route);
  } catch {
    throw new Error(
      `Invalid route path: ${route}`,
    );
  }

  const segments = decodedRoute
    .split("/")
    .filter(Boolean);

  if (
    segments.some(
      (segment) =>
        segment === "." ||
        segment === "..",
    )
  ) {
    throw new Error(
      `Route path cannot escape dist: ${route}`,
    );
  }

  return path.join(
    ...segments,
    "index.html",
  );
}

async function generateRouteEntries() {
  validateStaticRoutes(staticRoutes);

  const indexPath = path.join(
    DIST_DIR,
    "index.html",
  );

  const baseHtml = await fs.readFile(
    indexPath,
    "utf8",
  );

  for (const route of staticRoutes) {
    const canonical = new URL(
      route.path,
      SITE_ORIGIN,
    ).href;

    const outputPath = path.resolve(
      DIST_DIR,
      routeOutputPath(route.path),
    );

    const distPrefix = `${DIST_DIR}${path.sep}`;

    if (
      outputPath !== DIST_DIR &&
      !outputPath.startsWith(distPrefix)
    ) {
      throw new Error(
        `Route output escapes dist: ${route.path}`,
      );
    }

    const html = renderRouteHtml(
      baseHtml,
      {
        ...route,
        canonical,
      },
    );

    await fs.mkdir(
      path.dirname(outputPath),
      {
        recursive: true,
      },
    );

    await fs.writeFile(
      outputPath,
      html,
      "utf8",
    );
  }

  const notFoundHtml = renderRouteHtml(
    baseHtml,
    {
      title: "Page not found — Qarumi",
      description:
        "The requested page could not be found.",
      robots: "noindex",
    },
  );

  await fs.writeFile(
    path.join(DIST_DIR, "404.html"),
    notFoundHtml,
    "utf8",
  );
}

const isDirectExecution =
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    fileURLToPath(import.meta.url);

if (isDirectExecution) {
  await generateRouteEntries();
}
