import {
  ArrowLeft,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Wrench,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMachines } from "../services/api";

const fallbackMachines = [
  {
    machine_id: "CNC-04",
    name: "CNC Machining Center",
    status: "warning",
    issue: "Excessive vibration",
    load: "82%",
    maintenance: "2 days ago",
  },
  {
    machine_id: "PRESS-02",
    name: "Hydraulic Press",
    status: "operational",
    issue: "No active issues",
    load: "64%",
    maintenance: "5 days ago",
  },
  {
    machine_id: "LATHE-03",
    name: "Precision Lathe",
    status: "critical",
    issue: "Spindle error SP-881",
    load: "91%",
    maintenance: "12 days ago",
  },
  {
    machine_id: "ROBOT-07",
    name: "Assembly Robot",
    status: "operational",
    issue: "No active issues",
    load: "71%",
    maintenance: "3 days ago",
  },
  {
    machine_id: "CNC-02",
    name: "CNC Machining Center",
    status: "operational",
    issue: "No active issues",
    load: "68%",
    maintenance: "7 days ago",
  },
];

function Machines() {
  const navigate = useNavigate();
  const [machines, setMachines] = useState(fallbackMachines);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    getMachines()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Unexpected machines response.");
        }

        setMachines(data);
        setApiError("");
      })
      .catch((error) => setApiError(error.message));
  }, []);

  return (
    <div className="machines-page">
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={16} />
        Back to overview
      </button>

      <div className="machines-header">
        <div>
          <div className="eyebrow">
            FACTORY OPERATIONS · MACHINES
          </div>

          <h1>Machine Health</h1>

          <p>
            Monitor the current operational state of production
            machines across the plant.
          </p>
        </div>

        <div className="machine-live-badge">
          <Activity size={15} />
          Live plant status
        </div>
      </div>

      {/* MACHINE SUMMARY */}

      <section className="machine-summary-grid">
        <SummaryCard
          icon={<CheckCircle2 size={19} />}
          title="Operational"
          value="47"
          description="Machines running normally"
          type="success"
        />

        <SummaryCard
          icon={<AlertTriangle size={19} />}
          title="Warning"
          value="2"
          description="Requires attention"
          type="warning"
        />

        <SummaryCard
          icon={<AlertTriangle size={19} />}
          title="Critical"
          value="1"
          description="Immediate investigation"
          type="critical"
        />

        <SummaryCard
          icon={<Gauge size={19} />}
          title="Average load"
          value="73%"
          description="Across active machines"
          type="memory"
        />
      </section>

      {/* MACHINE LIST */}

      <section className="panel machines-list-panel">
        <div className="panel-header">
          <div>
            <h2>Production machines</h2>

            <p>
              Current health and operational information.
            </p>
          </div>

          <Gauge size={20} />
        </div>

        {apiError && <p>{`Live data unavailable: ${apiError}`}</p>}

        {machines.map((machine) => (
          <MachineRow
            key={machine.machine_id}
            id={machine.machine_id}
            name={machine.name}
            status={machine.status}
            load={machine.load || "Not reported"}
            issue={machine.issue || "No active issues"}
            maintenance={machine.maintenance || "Not reported"}
          />
        ))}
      </section>

      {/* MACHINE INTELLIGENCE */}

      <section className="machine-intelligence panel">
        <div className="machine-intelligence-icon">
          <Wrench size={21} />
        </div>

        <div>
          <strong>Machine issues are connected to Factory Memory</strong>

          <p>
            When a machine reports an issue, Factory Memory can
            search previous incidents involving the same machine
            or similar symptoms.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() => navigate("/factory-memory")}
        >
          Explore Memory
        </button>
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  description,
  type,
}) {
  return (
    <div className="machine-summary-card">
      <div className={`machine-summary-icon ${type}`}>
        {icon}
      </div>

      <div>
        <span>{title}</span>

        <strong>{value}</strong>

        <small>{description}</small>
      </div>
    </div>
  );
}

function MachineRow({
  id,
  name,
  status,
  load,
  issue,
  maintenance,
}) {
  const normalizedStatus = String(status || "operational").toLowerCase();
  const statusLabel =
    normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

  return (
    <div className="machine-row">
      <div className="machine-row-main">
        <div className="machine-row-icon">
          <Gauge size={18} />
        </div>

        <div>
          <span className="machine-row-id">
            {id}
          </span>

          <h3>{name}</h3>
        </div>
      </div>

      <div className="machine-row-status">
        <span
          className={`machine-status-dot ${normalizedStatus}`}
        />

        <span>{statusLabel}</span>
      </div>

      <div className="machine-row-load">
        <span>Load</span>

        <strong>{load}</strong>

        <div className="machine-row-load-bar">
          <div
            className={`machine-row-load-progress ${normalizedStatus}`}
            style={{ width: load.endsWith("%") ? load : "0%" }}
          />
        </div>
      </div>

      <div className="machine-row-issue">
        <span>Current issue</span>

        <strong>{issue}</strong>
      </div>

      <div className="machine-row-maintenance">
        <span>Last maintenance</span>

        <strong>{maintenance}</strong>
      </div>
    </div>
  );
}

export default Machines;