import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

import {
  renderRouteHtml,
  routeOutputPath,
} from "../scripts/generate-route-entries.mjs";

test("routeOutputPath maps privacy route to nested index", () => {
  assert.equal(routeOutputPath("/privacy"), path.join("privacy", "index.html"));
});

test("routeOutputPath maps nested project route", () => {
  assert.equal(
    routeOutputPath("/projects/qrumix"),
    path.join("projects", "qrumix", "index.html"),
  );
});

test("routeOutputPath rejects paths that escape dist", () => {
  assert.throws(() => routeOutputPath("/../../escape"), /invalid|escape/i);
});

test("renderRouteHtml can mark 404 HTML as noindex", () => {
  const baseHtml = `
    <!doctype html>
    <html>
      <head>
        <title>Qarumi</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `;

  const html = renderRouteHtml(baseHtml, {
    title: "Page not found",
    description: "The requested page does not exist.",
    robots: "noindex",
  });

  assert.match(html, /<meta\s+name="robots"\s+content="noindex"\s*\/?>/i);
});
