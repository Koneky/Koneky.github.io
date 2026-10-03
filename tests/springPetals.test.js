import test from "node:test";
import assert from "node:assert/strict";

import { springPetals } from "../src/components/seasonal/springPetals.js";

test("spring effect defines exactly 21 petals", () => {
  assert.equal(springPetals.length, 21);
});

test("spring petals are evenly distributed across depth layers", () => {
  const counts = springPetals.reduce(
    (result, petal) => {
      result[petal.depth] += 1;
      return result;
    },
    {
      far: 0,
      mid: 0,
      near: 0,
    },
  );

  assert.deepEqual(counts, {
    far: 7,
    mid: 7,
    near: 7,
  });
});

test("every spring petal has stable animation values", () => {
  springPetals.forEach((petal, index) => {
    assert.equal(petal.id, index + 1);

    assert.ok(petal.left >= 0 && petal.left <= 100);

    assert.ok(petal.size > 0);
    assert.ok(petal.duration > 0);

    assert.ok(["far", "mid", "near"].includes(petal.depth));
  });
});
