import {
  Factory,
  LayoutDashboard,
  AlertTriangle,
  BrainCircuit,
  Gauge,
  History,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Factory size={20} />
        </div>

        <div>
          <h2>
            Factory<span>Memory</span>
          </h2>

          <p>Operational Intelligence</p>
        </div>
      </div>

      <div className="section-label">
        OPERATIONS
      </div>

      <nav className="navigation">

        {/* OVERVIEW */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </NavLink>

        {/* INCIDENTS */}
        <NavLink
          to="/report-incident"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <AlertTriangle size={18} />
          <span>Incidents</span>
          <span className="nav-count">3</span>
        </NavLink>

        {/* FACTORY MEMORY */}
        <NavLink
          to="/factory-memory"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <BrainCircuit size={18} />
          <span>Factory Memory</span>
        </NavLink>

        {/* MACHINES */}
        <NavLink
          to="/machines"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Gauge size={18} />
          <span>Machines</span>
        </NavLink>

        {/* HISTORY */}
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <History size={18} />
          <span>History</span>
        </NavLink>

      </nav>

      <div className="sidebar-bottom">

        {/* SETTINGS */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        <div className="user">
          <div className="user-avatar">
            RK
          </div>

          <div className="user-info">
            <strong>Ravi Kumar</strong>
            <span>Plant Operations</span>
          </div>
        </div>

      </div>
    </aside>
  );
}

export default Sidebar;