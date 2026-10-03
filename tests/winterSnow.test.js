import test from "node:test";
import assert from "node:assert/strict";

import { winterSnow } from "../src/components/seasonal/winterSnow.js";

test("winter effect defines exactly 33 snowflakes", () => {
  assert.equal(winterSnow.length, 33);
});

test("winter snow is evenly distributed across depth layers", () => {
  const counts = winterSnow.reduce(
    (result, snowflake) => {
      result[snowflake.depth] += 1;
      return result;
    },
    {
      far: 0,
      mid: 0,
      near: 0,
    },
  );

  assert.deepEqual(counts, {
    far: 11,
    mid: 11,
    near: 11,
  });
});

test("exactly 20 snowflakes remain visible on mobile", () => {
  const visible = winterSnow.filter((snowflake) => snowflake.mobile);

  assert.equal(visible.length, 20);
});

test("every snowflake has stable animation values", () => {
  winterSnow.forEach((snowflake, index) => {
    assert.equal(snowflake.id, index + 1);

    assert.ok(snowflake.left >= 0 && snowflake.left <= 100);

    assert.ok(snowflake.size > 0);
    assert.ok(snowflake.duration > 0);

    assert.ok(["far", "mid", "near"].includes(snowflake.depth));
  });
});

test("winter snow gets more detailed in closer layers", () => {
  const far = winterSnow.filter((snowflake) => snowflake.depth === "far");

  const mid = winterSnow.filter((snowflake) => snowflake.depth === "mid");

  const near = winterSnow.filter((snowflake) => snowflake.depth === "near");

  assert.ok(far.every((snowflake) => snowflake.shape === "dot"));

  assert.ok(mid.some((snowflake) => snowflake.shape === "crystal"));

  assert.ok(mid.some((snowflake) => snowflake.shape === "dot"));

  assert.ok(near.every((snowflake) => snowflake.shape === "flake"));
});
