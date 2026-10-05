export async function copyText(text) {
  if (
    typeof navigator === "undefined"
    || !navigator.clipboard
    || typeof navigator.clipboard.writeText !== "function"
  ) {
    throw new Error("Clipboard API is not unavailable");
  }

  await navigator.clipboard.writeText(text);
}
