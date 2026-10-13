
const TYPING_TAGS = new Set([
  "INPUT",
  "TEXTAREA",
  "SELECT",
]);

export function isTypingTarget(target) {
  let element = target;

  while (element && typeof element === "object") {
    const tagName =
      typeof element.tagName === "string"
        ? element.tagName.toUpperCase()
        : "";

    if (
      TYPING_TAGS.has(tagName) ||
      element.isContentEditable === true
    ) {
      return true;
    }

    element = element.parentElement ?? null;
  }

  return false;
}
