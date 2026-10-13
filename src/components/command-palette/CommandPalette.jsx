
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import { commands } from "../../data/commands.js";
import { searchCommands } from "../../commands/searchCommands.js";
import { executeCommand } from "../../commands/executeCommand.js";
import { copyText } from "../../utils/clipboard.js";
import { useCommandUI } from "../../context/useCommandUI.js";
import { useLanguage } from "../../context/useLanguage.js";
import { trackEvent } from "../../analytics/analytics.js";

import "./commandPalette.css";

function PaletteDialog({ closePalette }) {
  const navigate = useNavigate();
  const { language, t, setLanguage } = useLanguage();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const openerRef = useRef(null);
  const activeButtonRef = useRef(null);


  const localizedCommands = useMemo(
    () =>
      commands
        .filter(
          (command) =>
            command.action?.type !== "setLanguage" ||
            command.action.language !== language,
        )
        .map((command) => ({
          ...command,
          labelKey:
            t.commandPalette.commands[command.id] ??
            command.labelKey,
        })),
    [language, t],
  );


  const results = useMemo(
    () => searchCommands(localizedCommands, query),
    [localizedCommands, query],
  );

  const activeIndex = results.length > 0
    ? Math.min(selectedIndex, results.length - 1)
    : -1;

  const selectedCommand =
    activeIndex >= 0 ? results[activeIndex] : null;

  // Initial focus, focus restoration and scroll lock.
  useEffect(() => {
    openerRef.current = document.activeElement;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;

      if (openerRef.current?.isConnected) {
        openerRef.current.focus();
      }
    };
  }, []);

  // Keep the selected command visible.
  useEffect(() => {
    activeButtonRef.current?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  async function runCommand(command) {
    if (!command) {
      return;
    }

    try {
      await executeCommand(command, {
        navigate,
        setLanguage,
        openExternal(url) {
          window.open(
            url,
            "_blank",
            "noopener,noreferrer",
          );
        },
        copyText,
      });

      // Only predefined registry IDs are allowed in analytics.
      if (commands.some((item) => item.id === command.id)) {
        trackEvent("command_execute", {
          command_id: command.id,
        });
      }

      closePalette();
    } catch (error) {
      console.error(
        "Command execution failed:",
        error,
      );
    }
  }

  function trapFocus(event) {
    const focusableElements = Array.from(
      dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter(
      (element) => element.getClientRects().length > 0,
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialogRef.current?.focus();
      return;
    }

    const first = focusableElements[0];
    const last =
      focusableElements[focusableElements.length - 1];

    const current = document.activeElement;
    const isInside = dialogRef.current?.contains(current);

    if (
      event.shiftKey &&
      (current === first || !isInside)
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (current === last || !isInside)
    ) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
      return;
    }

    if (event.key === "Tab") {
      trapFocus(event);
      return;
    }

    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp"
    ) {
      if (results.length === 0) {
        return;
      }

      event.preventDefault();

      const direction =
        event.key === "ArrowDown" ? 1 : -1;

      setSelectedIndex(
        (current) =>
          (
            Math.min(current, results.length - 1) +
            direction +
            results.length
          ) % results.length,
      );

      inputRef.current?.focus();
      return;
    }

    if (
      event.key === "Enter" &&
      event.target === inputRef.current &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void runCommand(selectedCommand);
    }
  }

  return createPortal(
    <div
      className="command-palette__overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closePalette();
        }
      }}
    >
      <section
        ref={dialogRef}
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-palette-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <header className="command-palette__header">
          <h2
            id="command-palette-title"
            className="command-palette__title"
          >
            {t.commandPalette.title}
          </h2>

          <button
            type="button"
            className="command-palette__close"
            onClick={closePalette}
            aria-label={t.commandPalette.close}
          >
            ×
          </button>
        </header>

        <div className="command-palette__search">
          <span
            className="command-palette__search-icon"
            aria-hidden="true"
          >
            ⌕
          </span>

          <input
            ref={inputRef}
            type="search"
            className="command-palette__input"
            placeholder={t.commandPalette.placeholder}
            aria-label={t.commandPalette.placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="command-palette__results">
          {results.length > 0 ? (
            <ul className="command-palette__list">
              {results.map((command, index) => (
                <li
                  key={command.id}
                  className="command-palette__item"
                >
                  <button
                    ref={
                      index === activeIndex
                        ? activeButtonRef
                        : null
                    }
                    type="button"
                    className={
                      index === activeIndex
                        ? "command-palette__command command-palette__command--active"
                        : "command-palette__command"
                    }
                    onMouseEnter={() => {
                      setSelectedIndex(index);
                    }}
                    onClick={() => {
                      void runCommand(command);
                    }}
                  >
                    <span>
                      {command.labelKey}
                    </span>

                    {index === activeIndex && (
                      <span
                        className="command-palette__enter"
                        aria-hidden="true"
                      >
                        ↵
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className="command-palette__empty"
              role="status"
            >
              {t.commandPalette.empty}
            </p>
          )}
        </div>

        <p
          className="command-palette__sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          {selectedCommand?.labelKey ?? ""}
        </p>
      </section>
    </div>,
    document.body,
  );
}

export default function CommandPalette() {
  const { isOpen, closePalette } = useCommandUI();

  if (!isOpen) {
    return null;
  }

  return <PaletteDialog closePalette={closePalette} />;
}
