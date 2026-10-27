import test from "node:test";
import assert from "node:assert/strict";

import {
  searchCommands,
} from "../src/commands/searchCommands.js";

import {
  executeCommand,
} from "../src/commands/executeCommand.js";

import { commands } from "../src/data/commands.js";
import { routePaths } from "../src/router/routeConfig.js";
import { translations } from "../src/i18n/translations.js";

function createCommand(
  id,
  labelKey,
  {
    keywords = [],
    visibility = "public",
    action = { type: "navigate", to: "/" },
  } = {},
) {
  return {
    id,
    labelKey,
    keywords,
    visibility,
    action,
  };
}

test("search ranks exact > startsWith > includes > keywords", () => {
  const commands = [
    createCommand("keyword", "Frontend tools", {
      keywords: ["react"],
    }),
    createCommand("includes", "Learning React basics"),
    createCommand("starts", "React projects"),
    createCommand("exact", "React"),
  ];

  const results = searchCommands(commands, "react");

  assert.deepEqual(
    results.map((command) => command.id),
    ["exact", "starts", "includes", "keyword"],
  );
});

test("search normalizes case and whitespace", () => {
  const commands = [
    createCommand("projects", "Open   Projects"),
    createCommand("contact", "Contact"),
  ];

  const results = searchCommands(
    commands,
    "  OPEN  projects  ",
  );

  assert.deepEqual(
    results.map((command) => command.id),
    ["projects"],
  );
});

test("empty query returns only public commands", () => {
  const commands = [
    createCommand("about", "About"),
    createCommand("hidden", "Secret", {
      visibility: "hidden-search",
      keywords: ["secret"],
    }),
    createCommand("terminal", "Terminal action", {
      visibility: "terminal-only",
    }),
    createCommand("projects", "Projects"),
  ];

  const results = searchCommands(commands, "");

  assert.deepEqual(
    results.map((command) => command.id),
    ["about", "projects"],
  );
});

test("hidden-search command requires an explicit matching query", () => {
  const commands = [
    createCommand("about", "About"),
    createCommand("secret", "Special action", {
      visibility: "hidden-search",
      keywords: ["easter-egg"],
    }),
  ];

  assert.equal(
    searchCommands(commands, "").some(
      (command) => command.id === "secret",
    ),
    false,
  );

  assert.equal(
    searchCommands(commands, "about").some(
      (command) => command.id === "secret",
    ),
    false,
  );

  assert.equal(
    searchCommands(commands, "easter-egg").some(
      (command) => command.id === "secret",
    ),
    true,
  );
});

test("terminal-only commands never appear in palette search", () => {
  const commands = [
    createCommand("terminal", "Open Terminal", {
      visibility: "terminal-only",
      keywords: ["terminal"],
    }),
    createCommand("projects", "Projects"),
  ];

  for (const query of ["", "terminal", "Open Terminal"]) {
    const results = searchCommands(commands, query);

    assert.equal(
      results.some((command) => command.id === "terminal"),
      false,
    );
  }
});

test("executeCommand delegates navigation to its adapter", () => {
  const calls = [];

  const command = createCommand(
    "about",
    "About",
    {
      action: {
        type: "navigate",
        to: "/#about",
      },
    },
  );

  executeCommand(command, {
    navigate(to) {
      calls.push(to);
    },
  });

  assert.deepEqual(calls, ["/#about"]);
});

test("unknown actions throw a controlled error", () => {
  let arbitraryActionCalled = false;

  const command = createCommand(
    "unknown",
    "Unknown",
    {
      action: {
        type: "executeArbitrary",
        payload: "unsafe",
      },
    },
  );

  assert.throws(
    () => {
      executeCommand(command, {
        executeArbitrary() {
          arbitraryActionCalled = true;
        },
      });
    },
    /unknown|unsupported|invalid/i,
  );

  assert.equal(arbitraryActionCalled, false);
});

test("QRumiX command navigates to the case-study page", () => {
  const matches = commands.filter((command) => command.id === "qrumix");

  assert.equal(matches.length, 1, "Exactly one QRumiX command is required");

  const [command] = matches;

  assert.equal(command.visibility, "public");
  assert.equal(command.action.type, "navigate");

  assert.equal(command.action.to, routePaths.project("qrumix"));

  for (const language of ["en", "ru"]) {
    const label = translations[language].commandPalette.commands.qrumix;

    assert.equal(typeof label, "string");
    assert.ok(label.trim().length > 0);
  }
});
