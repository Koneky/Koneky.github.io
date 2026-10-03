import test from "node:test";
import assert from "node:assert/strict";

import { summerFireflies } from "../src/components/seasonal/summerFireflies.js";

test("summer effect defines exactly 15 fireflies", () => {
  assert.equal(summerFireflies.length, 15);
});

test("summer fireflies are evenly distributed across depth layers", () => {
  const counts = summerFireflies.reduce(
    (result, firefly) => {
      result[firefly.depth] += 1;
      return result;
    },
    {
      far: 0,
      mid: 0,
      near: 0,
    },
  );

  assert.deepEqual(counts, {
    far: 5,
    mid: 5,
    near: 5,
  });
});

test("exactly 9 fireflies remain visible on mobile", () => {
  const visible = summerFireflies.filter((firefly) => firefly.mobile);

  assert.equal(visible.length, 9);
});

test("every firefly has stable animation values", () => {
  summerFireflies.forEach((firefly, index) => {
    assert.equal(firefly.id, index + 1);

    assert.ok(firefly.left >= 0 && firefly.left <= 100);

    assert.ok(firefly.top >= 0 && firefly.top <= 100);

    assert.ok(firefly.size > 0);
    assert.ok(firefly.duration > 0);
    assert.ok(firefly.pulseDuration > 0);

    assert.ok(["far", "mid", "near"].includes(firefly.depth));
  });
});

test("summer fireflies do not start in tight clusters", () => {
  for (let first = 0; first < summerFireflies.length; first += 1) {
    for (let second = first + 1; second < summerFireflies.length; second += 1) {
      const a = summerFireflies[first];
      const b = summerFireflies[second];

      const xDistance = a.left - b.left;

      const yDistance = a.top - b.top;

      const distance = Math.hypot(xDistance, yDistance);

      assert.ok(
        distance >= 12,
        `fireflies ${a.id} and ${b.id} are too close: ${distance.toFixed(2)}`,
      );
    }
  }
});
