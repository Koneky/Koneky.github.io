import test from "node:test";
import assert from "node:assert/strict";

import { autumnLeaves } from "../src/components/seasonal/autumnLeaves.js";

test("autumn effect defines exactly 18 leaves", () => {
  assert.equal(autumnLeaves.length, 18);
});

test("autumn leaves are evenly distributed across depth layers", () => {
  const counts = autumnLeaves.reduce(
    (result, leaf) => {
      result[leaf.depth] += 1;
      return result;
    },
    {
      far: 0,
      mid: 0,
      near: 0,
    },
  );

  assert.deepEqual(counts, {
    far: 6,
    mid: 6,
    near: 6,
  });
});

test("exactly 10 autumn leaves remain visible on mobile", () => {
  const visible = autumnLeaves.filter((leaf) => leaf.mobile);

  assert.equal(visible.length, 10);
});

test("every autumn leaf has stable animation values", () => {
  autumnLeaves.forEach((leaf, index) => {
    assert.equal(leaf.id, index + 1);

    assert.ok(leaf.left >= 0 && leaf.left <= 100);

    assert.ok(leaf.size > 0);
    assert.ok(leaf.duration > 0);

    assert.ok(["far", "mid", "near"].includes(leaf.depth));
  });
});
