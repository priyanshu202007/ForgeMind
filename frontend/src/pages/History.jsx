import {
  ArrowLeft,
  History as HistoryIcon,
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
  Clock3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getIncidents } from "../services/api";

const fallbackIncidents = [
  {
    incident_id: "INC-1025",
    machine_id: "CNC-04",
    defect: "Excessive vibration",
    resolution: "Spindle alignment corrected",
    outcome: "Resolved",
    date: "Just now",
  },
  {
    incident_id: "INC-1023",
    machine_id: "PRESS-02",
    defect: "Hydraulic pressure drop",
    resolution: "Pressure seal replaced",
    outcome: "Resolved",
    date: "2 hours ago",
  },
  {
    incident_id: "INC-1021",
    machine_id: "ROBOT-07",
    defect: "Gripper alignment",
    resolution: "Actuator mount tightened",
    outcome: "Resolved",
    date: "5 hours ago",
  },
  {
    incident_id: "INC-1017",
    machine_id: "CNC-02",
    defect: "Spindle vibration",
    resolution: "Bearing assembly replaced",
    outcome: "Resolved",
    date: "Yesterday",
  },
  {
    incident_id: "INC-1012",
    machine_id: "LATHE-03",
    defect: "High spindle temperature",
    resolution: "Cooling system cleaned",
    outcome: "Resolved",
    date: "Yesterday",
  },
  {
    incident_id: "INC-1008",
    machine_id: "PRESS-01",
    defect: "Hydraulic pressure fluctuation",
    resolution: "Under investigation",
    outcome: "Investigating",
    date: "2 days ago",
  },
];

function History() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState(fallbackIncidents);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    getIncidents()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Unexpected incidents response.");
        }

        setIncidents(data);
        setApiError("");
      })
      .catch((error) => setApiError(error.message));
  }, []);

  const resolvedCount = incidents.filter((incident) =>
    String(incident.outcome || "").toLowerCase().includes("resolved")
  ).length;

  return (
    <div className="history-page">
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={16} />
        Back to overview
      </button>

      <div className="history-header">
        <div>
          <div className="eyebrow">
            FACTORY OPERATIONS · HISTORY
          </div>

          <h1>Incident History</h1>

          <p>
            Review previous incidents, investigations and
            resolutions from the factory.
          </p>
        </div>

        <div className="history-live-badge">
          <HistoryIcon size={15} />
          Historical records
        </div>
      </div>

      {/* SUMMARY */}

      <section className="history-summary-grid">
        <SummaryCard
          icon={<HistoryIcon size={19} />}
          title="Total incidents"
          value={incidents.length}
          description="Recorded experiences"
          type="memory"
        />

        <SummaryCard
          icon={<CheckCircle2 size={19} />}
          title="Resolved"
          value={resolvedCount}
          description="Successfully resolved"
          type="success"
        />

        <SummaryCard
          icon={<AlertTriangle size={19} />}
          title="Investigating"
          value="3"
          description="Currently active"
          type="warning"
        />

        <SummaryCard
          icon={<BrainCircuit size={19} />}
          title="Memory created"
          value="1,285"
          description="Operational experiences"
          type="info"
        />
      </section>

      {/* HISTORY LIST */}

      <section className="panel history-list-panel">
        <div className="panel-header">
          <div>
            <h2>Recent incident history</h2>

            <p>
              Previous factory incidents and their outcomes.
            </p>
          </div>

          <HistoryIcon size={20} />
        </div>

        {apiError && <p>{`Live data unavailable: ${apiError}`}</p>}

        {incidents.map((incident) => (
          <HistoryRow
            key={incident.incident_id}
            incident={incident.incident_id}
            machine={incident.machine_id}
            issue={incident.defect}
            resolution={incident.resolution || "No resolution recorded"}
            status={String(incident.outcome || "").toLowerCase().includes("resolved")
              ? "Resolved"
              : "Investigating"}
            time={incident.date || "Recorded"}
          />
        ))}
      </section>

      {/* MEMORY CONNECTION */}

      <section className="history-memory-panel panel">
        <div className="history-memory-icon">
          <BrainCircuit size={21} />
        </div>

        <div>
          <strong>
            Every resolved incident becomes Factory Memory
          </strong>

          <p>
            Historical incidents provide evidence for future
            investigations and help Factory Memory identify
            recurring patterns.
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
    <div className="history-summary-card">
      <div className={`history-summary-icon ${type}`}>
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

function HistoryRow({
  incident,
  machine,
  issue,
  resolution,
  status,
  time,
}) {
  const isResolved = status === "Resolved";

  return (
    <div className="history-row">
      <div className="history-row-main">
        <div className="history-row-icon">
          {isResolved ? (
            <CheckCircle2 size={17} />
          ) : (
            <AlertTriangle size={17} />
          )}
        </div>

        <div>
          <span className="history-row-id">
            {incident} · {machine}
          </span>

          <h3>{issue}</h3>

          <p>
            <strong>Resolution:</strong> {resolution}
          </p>
        </div>
      </div>

      <div
        className={`history-status ${
          isResolved ? "resolved" : "investigating"
        }`}
      >
        {isResolved ? (
          <CheckCircle2 size={14} />
        ) : (
          <AlertTriangle size={14} />
        )}

        {status}
      </div>

      <div className="history-time">
        <Clock3 size={14} />
        {time}
      </div>
    </div>
  );
}

export default History;