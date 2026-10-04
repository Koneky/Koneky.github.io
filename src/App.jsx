import { Route, Routes } from "react-router-dom";

import SiteLayout from "./layouts/SiteLayout";
import HomePage from "./pages/HomePage";
import NotPoundPage from "./pages/NotFoundPage";
import { routePaths } from "./router/routeConfig";

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path={routePaths.home} element={<HomePage />} />

        <Route path="*" element={<NotPoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
