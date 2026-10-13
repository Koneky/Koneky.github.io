
import { useContext } from "react";

import { CommandUIContext } from "./CommandUIContext.jsx";

export function useCommandUI() {
  const context = useContext(CommandUIContext);

  if (!context) {
    throw new Error(
      "useCommandUI must be used within CommandUIProvider",
    );
  }

  return context;
}
