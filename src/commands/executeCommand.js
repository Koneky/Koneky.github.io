
const supportedActions = new Set([
  "navigate",
  "setLanguage",
  "openExternal",
  "copyText",
]);

export function executeCommand(command, adapters = {}) {
  const action = command?.action;
  const type = action?.type;

  if (!supportedActions.has(type)) {
    throw new Error(
      `Unsupported command action: ${String(type)}`,
    );
  }

  const adapter = adapters[type];

  if (typeof adapter !== "function") {
    throw new Error(
      `Missing adapter for command action: ${type}`,
    );
  }

  switch (type) {
    case "navigate":
      return adapter(action.to);

    case "setLanguage":
      return adapter(action.language);

    case "openExternal":
      return adapter(action.url);

    case "copyText":
      return adapter(action.text);

    default:
      throw new Error(
        `Unsupported command action: ${String(type)}`,
      );
  }
}
