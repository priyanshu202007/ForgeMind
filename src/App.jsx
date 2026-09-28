import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import ReportIncident from "./pages/ReportIncident";
import Investigation from "./pages/Investigation";
import Resolution from "./pages/Resolution";
import FactoryMemory from "./pages/Factorymemory";
import Machines from "./pages/Machines";
import History from "./pages/History";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <Topbar currentPage="Overview" />

          <div className="page-content">
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/report-incident"
                element={<ReportIncident />}
              />

              <Route
                path="/investigation"
                element={<Investigation />}
              />

              <Route
                path="/resolution"
                element={<Resolution />}
              />

              <Route
                path="/factory-memory"
                element={<FactoryMemory />}
              />

              <Route
                path="/machines"
                element={<Machines />}
              />

              <Route
                path="/history"
                element={<History />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;