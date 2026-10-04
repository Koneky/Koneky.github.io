import {
  Outlet,
  useLocation,
} from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SeasonalBackground from "../components/seasonal/SeasonalBackground";
import { useScrollReveal } from "../hooks/useScrollReveal";
import RouteScrollManager from "../router/RouteScrollManager";

function SiteLayout() {
  const location = useLocation();

  useScrollReveal(location.pathname);

  return (
    <>
      <SeasonalBackground />
      <RouteScrollManager />
      <Header />

      <Outlet />

      <Footer />
    </>
  );
}

export default SiteLayout;
