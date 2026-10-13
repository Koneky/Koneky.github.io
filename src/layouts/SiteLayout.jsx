
import {
  Outlet,
  useLocation,
} from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SeasonalBackground from "../components/seasonal/SeasonalBackground";
import CommandPalette from "../components/command-palette/CommandPalette";
import { useScrollReveal } from "../hooks/useScrollReveal";
import RouteScrollManager from "../router/RouteScrollManager";
import { CommandUIProvider } from "../context/CommandUIProvider";

function SiteLayout() {
  const location = useLocation();

  useScrollReveal(location.pathname);

  return (
    <CommandUIProvider>
      <SeasonalBackground />
      <RouteScrollManager />
      <Header />
      <CommandPalette />

      <Outlet />

      <Footer />
    </CommandUIProvider>
  );
}

export default SiteLayout;
