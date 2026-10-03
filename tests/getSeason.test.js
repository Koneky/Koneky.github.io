import test from "node:test";
import assert from "node:assert/strict";

import { getCalendarSeason, getSeason } from "../src/utils/getSeason.js";

test("getCalendarSeason maps months to seasons", () => {
  assert.equal(getCalendarSeason(0), "winter");
  assert.equal(getCalendarSeason(2), "spring");
  assert.equal(getCalendarSeason(5), "summer");
  assert.equal(getCalendarSeason(8), "autumn");
  assert.equal(getCalendarSeason(11), "winter");
});

test("getSeason uses valid season override", () => {
  const result = getSeason("?season=winter", new Date(2026, 6, 1));

  assert.equal(result, "winter");
});

test("getSeason finds season override among other query params", () => {
  const result = getSeason("?foo=1&season=spring&bar=2", new Date(2026, 9, 1));

  assert.equal(result, "spring");
});

test("getSeason ignores invalid override", () => {
  const result = getSeason("?season=invalid", new Date(2026, 9, 1));

  assert.equal(result, "autumn");
});

test("getSeason falls back to calendar season", () => {
  const result = getSeason("", new Date(2026, 9, 1));

  assert.equal(result, "autumn");
});
