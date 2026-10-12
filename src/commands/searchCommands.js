
function normalize(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function getMatchScore(command, query) {
  const label = normalize(command.labelKey);

  if (label === query) {
    return 4;
  }

  if (label.startsWith(query)) {
    return 3;
  }

  if (label.includes(query)) {
    return 2;
  }

  const keywords = command.keywords ?? [];

  if (
    keywords.some((keyword) =>
      normalize(keyword).includes(query),
    )
  ) {
    return 1;
  }

  return 0;
}

export function searchCommands(commands, query) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return commands.filter(
      (command) => command.visibility === "public",
    );
  }

  return commands
    .map((command, index) => ({
      command,
      index,
      score: getMatchScore(command, normalizedQuery),
    }))
    .filter(({ command, score }) => {
      if (command.visibility === "terminal-only") {
        return false;
      }

      if (score === 0) {
        return false;
      }

      if (command.visibility === "hidden-search") {
        return (command.keywords ?? []).some(
          (keyword) =>
            normalize(keyword) === normalizedQuery,
        );
      }

      return command.visibility === "public";
    })
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }

      return a.index - b.index;
    })
    .map(({ command }) => command);
}
