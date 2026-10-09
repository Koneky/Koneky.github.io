import { Route, Routes } from "react-router-dom";

import SiteLayout from "./layouts/SiteLayout";
import HomePage from "./pages/HomePage";
import NotPoundPage from "./pages/NotFoundPage";
import { routePaths } from "./router/routeConfig";
import PrivacyPage from "./pages/PrivacyPage";

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path={routePaths.home} element={<HomePage />} />

        <Route path={routePaths.privacy} element={<PrivacyPage />} />

        <Route path="*" element={<NotPoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
