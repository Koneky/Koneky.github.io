import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SeasonalBackground from "../components/seasonal/SeasonalBackground";
import { useScrollReveal } from "../hooks/useScrollReveal";

function SiteLayout() {
  useScrollReveal();

  return (
    <>
      <SeasonalBackground />
      <Header />

      <Outlet />

      <Footer />
    </>
  );
}

export default SiteLayout;
