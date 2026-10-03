import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizePointer,
  calculateParallaxOffsets,
} from "../src/hooks/useParallax.js";

test("normalizePointer maps viewport center to zero", () => {
  const result = normalizePointer(500, 400, 1000, 800);

  assert.deepEqual(result, {
    x: 0,
    y: 0,
  });
});

test("normalizePointer maps top-left to negative extremes", () => {
  const result = normalizePointer(0, 0, 1000, 800);

  assert.deepEqual(result, {
    x: -1,
    y: -1,
  });
});

test("normalizePointer maps bottom-right to positive extremes", () => {
  const result = normalizePointer(1000, 800, 1000, 800);

  assert.deepEqual(result, {
    x: 1,
    y: 1,
  });
});

test("normalizePointer clamps coordinates outside the viewport", () => {
  const result = normalizePointer(1500, -400, 1000, 800);

  assert.deepEqual(result, {
    x: 1,
    y: -1,
  });
});

test("calculateParallaxOffsets returns zero offsets at rest", () => {
  const result = calculateParallaxOffsets(0, 0, 0);

  assert.deepEqual(result, {
    far: {
      x: 0,
      y: 0,
    },
    mid: {
      x: 0,
      y: 0,
    },
    near: {
      x: 0,
      y: 0,
    },
  });
});

test("pointer movement stays inside layer envelopes", () => {
  const result = calculateParallaxOffsets(0, 1, 1);

  assert.ok(Math.abs(result.far.x) <= 4);
  assert.ok(Math.abs(result.far.y) <= 3);

  assert.ok(Math.abs(result.mid.x) <= 8);
  assert.ok(Math.abs(result.mid.y) <= 6);

  assert.ok(Math.abs(result.near.x) <= 12);
  assert.ok(Math.abs(result.near.y) <= 9);
});

test("very large scroll values stay bounded", () => {
  const result = calculateParallaxOffsets(10_000_000, 0, 0);

  assert.equal(result.far.x, 0);
  assert.equal(result.mid.x, 0);
  assert.equal(result.near.x, 0);

  assert.ok(Math.abs(result.far.y) <= 6);
  assert.ok(Math.abs(result.mid.y) <= 12);
  assert.ok(Math.abs(result.near.y) <= 18);
});
