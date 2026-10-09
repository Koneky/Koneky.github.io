import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { ConsentProvider } from "./context/ConsentProvider.jsx";
import { LanguageProvider } from "./context/LanguageProvider.jsx";
import CookieBanner from "./components/consent/CookieBanner.jsx";
import CookiePreferences from "./components/consent/CookiePreferences.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <ConsentProvider>
        <BrowserRouter>
          <App />
          <CookieBanner />
          <CookiePreferences />
        </BrowserRouter>
      </ConsentProvider>
    </LanguageProvider>
  </StrictMode>,
);
