
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { CommandUIContext } from "./CommandUIContext.jsx";
import { isTypingTarget } from "../utils/keyboard.js";
import { trackEvent } from "../analytics/analytics.js";

export function CommandUIProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPalette = useCallback(() => {
    if (isOpen) {
      return;
    }

    setIsOpen(true);

    trackEvent("command_palette_open");
  }, [isOpen]);

  const closePalette = useCallback(() => {
    setIsOpen(false);
  }, []);


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }

      const isCommandShortcut =
        (event.ctrlKey || event.metaKey) &&
        (
          event.code === "KeyK" ||
          event.key?.toLowerCase() === "k"
        );

      if (!isCommandShortcut) {
        return;
      }

      // Palette is already open.
      // Prevent the browser's native Ctrl/Cmd+K search.
      if (isOpen) {
        event.preventDefault();
        return;
      }

      // Avoid repeated shortcut activation.
      if (event.repeat) {
        return;
      }

      // Do not hijack typing in ordinary form fields.
      if (isTypingTarget(event.target)) {
        return;
      }

      event.preventDefault();
      openPalette();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, openPalette]);


  const value = useMemo(
    () => ({
      isOpen,
      openPalette,
      closePalette,
    }),
    [isOpen, openPalette, closePalette],
  );

  return (
    <CommandUIContext.Provider value={value}>
      {children}
    </CommandUIContext.Provider>
  );
}
