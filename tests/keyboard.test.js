
import test from "node:test";
import assert from "node:assert/strict";

import {
  isTypingTarget,
} from "../src/utils/keyboard.js";

test("input elements are typing targets", () => {
  const target = {
    tagName: "INPUT",
  };

  assert.equal(isTypingTarget(target), true);
});

test("textarea elements are typing targets", () => {
  const target = {
    tagName: "TEXTAREA",
  };

  assert.equal(isTypingTarget(target), true);
});

test("select elements are typing targets", () => {
  const target = {
    tagName: "SELECT",
  };

  assert.equal(isTypingTarget(target), true);
});

test("contenteditable elements are typing targets", () => {
  const target = {
    tagName: "DIV",
    isContentEditable: true,
  };

  assert.equal(isTypingTarget(target), true);
});

test("descendants of contenteditable elements are typing targets", () => {
  const parent = {
    tagName: "DIV",
    isContentEditable: true,
    parentElement: null,
  };

  const target = {
    tagName: "SPAN",
    isContentEditable: false,
    parentElement: parent,
  };

  assert.equal(isTypingTarget(target), true);
});

test("ordinary elements are not typing targets", () => {
  const targets = [
    { tagName: "BUTTON" },
    { tagName: "DIV" },
    { tagName: "BODY" },
    { tagName: "A" },
    { tagName: "SPAN" },
  ];

  for (const target of targets) {
    assert.equal(
      isTypingTarget(target),
      false,
      `${target.tagName} should not block shortcuts`,
    );
  }
});

test("non-editable content is not a typing target", () => {
  const target = {
    tagName: "DIV",
    isContentEditable: false,
    parentElement: null,
  };

  assert.equal(isTypingTarget(target), false);
});

test("null and invalid targets are handled safely", () => {
  assert.equal(isTypingTarget(null), false);
  assert.equal(isTypingTarget(undefined), false);
  assert.equal(isTypingTarget({}), false);
});
