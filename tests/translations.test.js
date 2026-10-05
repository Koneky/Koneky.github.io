import test from "node:test";
import assert from "node:assert/strict";

import { translations } from "../src/i18n/translations.js";

test("contact translations expose required social-link copy in every language", () => {
  for (const [language, translation] of Object.entries(translations)) {
    assert.equal(
      typeof translation.contact.copy,
      "string",
      `${language} contact.copy must exist`,
    );

    assert.equal(
      typeof translation.contact.copied,
      "string",
      `${language} contact.copied must exist`,
    );

    assert.equal(
      typeof translation.contact.copyEmail,
      "string",
      `${language} contact.copyEmail must exist`,
    );

    assert.equal(
      typeof translation.contact.links,
      "object",
      `${language} contact.links must exist`,
    );

    assert.equal(
      translation.contact.links.github,
      "GitHub",
      `${language} contact.links.github must exist`,
    );
  }
});
