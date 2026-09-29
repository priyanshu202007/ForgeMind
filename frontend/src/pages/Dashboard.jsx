import {
  AlertTriangle,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Gauge,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <section className="page-header">
        <div>
          <div className="eyebrow">FACTORY INTELLIGENCE</div>

          <div className="dashboard-title-row">
            <h1>Factory overview</h1>
            <span className="demo-environment-badge">DEMO FACTORY</span>
          </div>

          <p>
            Explore how ForgeMind connects factory incidents with operational memory.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/report-incident")}
        >
          + Report incident
        </button>
      </section>

      <section className="stats-grid">
        <StatCard
          icon={<AlertTriangle size={19} />}
          title="Active incidents"
          value="3"
          description="Sample · 2 high priority"
          type="warning"
        />

        <StatCard
          icon={<Gauge size={19} />}
          title="Machines online"
          value="47 / 50"
          description="Sample · 94% availability"
          type="success"
        />

        <StatCard
          icon={<CheckCircle2 size={19} />}
          title="Resolved today"
          value="18"
          description="Sample · +12% vs. average"
          type="info"
        />

        <StatCard
          icon={<BrainCircuit size={19} />}
          title="Memory experiences"
          value="1,284"
          description="Sample · +26 this week"
          type="memory"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent incidents</h2>
              <p>Sample incident records for demonstration.</p>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("/history")}
            >
              View all
              <ArrowUpRight size={15} />
            </button>
          </div>

          <IncidentRow
            id="INC-1024"
            machine="CNC-04"
            issue="Excessive vibration"
            severity="High"
            status="Investigating"
          />

          <IncidentRow
            id="INC-1023"
            machine="PRESS-02"
            issue="Hydraulic pressure drop"
            severity="Medium"
            status="Resolved"
          />

          <IncidentRow
            id="INC-1022"
            machine="LATHE-03"
            issue="Spindle error SP-881"
            severity="High"
            status="Investigating"
          />

          <IncidentRow
            id="INC-1021"
            machine="ROBOT-07"
            issue="Gripper alignment"
            severity="Low"
            status="Resolved"
          />
        </div>

        <div className="panel memory-panel">
          <div className="panel-header">
            <div>
              <h2>Factory Memory</h2>
              <p>
                How Hindsight memory supports investigation. Figures are sample data.
              </p>
            </div>

            <BrainCircuit size={20} />
          </div>

          <div className="memory-main">
            <div className="memory-number">1,284</div>

            <div className="memory-label">
              sample operational experiences
            </div>
          </div>

          <div className="memory-journey" aria-label="Factory Memory workflow">
            <div className="memory-journey-step">
              <span>01</span>
              <strong>Historical incidents</strong>
              <small>Past factory experience</small>
            </div>
            <div className="memory-journey-arrow" aria-hidden="true">↓</div>
            <div className="memory-journey-step">
              <span>02</span>
              <strong>Hindsight retrieves</strong>
              <small>Relevant memories</small>
            </div>
            <div className="memory-journey-arrow" aria-hidden="true">↓</div>
            <div className="memory-journey-step">
              <span>03</span>
              <strong>AI investigates</strong>
              <small>Evidence-informed analysis</small>
            </div>
            <div className="memory-journey-arrow" aria-hidden="true">↓</div>
            <div className="memory-journey-step">
              <span>04</span>
              <strong>Outcome retained</strong>
              <small>Future factory memory</small>
            </div>
          </div>

          <div className="memory-insight">
            <BrainCircuit size={18} />

            <p>
              Resolved outcomes can become searchable experience for future
              investigations. The figures shown here are illustrative demo data.
            </p>
          </div>

          <div className="memory-stats">
            <div>
              <strong>92%</strong>
                <span>sample retrieval relevance</span>
            </div>

            <div>
              <strong>86%</strong>
                <span>sample resolution success</span>
            </div>

            <div>
              <strong>26</strong>
                <span>sample new memories</span>
            </div>
          </div>

          <button
            className="secondary-button"
            onClick={() => navigate("/factory-memory")}
          >
            Explore Factory Memory
            <ArrowUpRight size={15} />
          </button>
        </div>
      </section>

      <section className="panel machines-panel">
        <div className="panel-header">
          <div>
            <h2>Machine health</h2>
            <p>Sample machine states and load values for demonstration.</p>
          </div>

          <button
            className="text-button"
            onClick={() => navigate("/machines")}
          >
            View machines
            <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="machine-grid">
          <MachineCard
            id="CNC-04"
            name="CNC Machining Center"
            status="Warning"
            load="82%"
          />

          <MachineCard
            id="PRESS-02"
            name="Hydraulic Press"
            status="Operational"
            load="64%"
          />

          <MachineCard
            id="ROBOT-07"
            name="Assembly Robot"
            status="Operational"
            load="71%"
          />

          <MachineCard
            id="LATHE-03"
            name="Precision Lathe"
            status="Critical"
            load="91%"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
  type,
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${type}`}>
        {icon}
      </div>

      <div className="stat-content">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>
    </div>
  );
}

function IncidentRow({
  id,
  machine,
  issue,
  severity,
  status,
}) {
  return (
    <div className="incident-row">
      <div
        className={`severity-bar ${severity.toLowerCase()}`}
      />

      <div className="incident-info">
        <span className="incident-id">
          {id} · {machine}
        </span>

        <strong>{issue}</strong>
      </div>

      <span
        className={`incident-status ${status.toLowerCase()}`}
      >
        {status}
      </span>

      <span
        className={`incident-severity ${severity.toLowerCase()}`}
      >
        {severity}
      </span>
    </div>
  );
}

function MachineCard({
  id,
  name,
  status,
  load,
}) {
  return (
    <div className="machine-card">
      <div className="machine-top">
        <span
          className={`machine-status ${status.toLowerCase()}`}
        >
          ● {status}
        </span>

        <span className="machine-id">{id}</span>
      </div>

      <h3>{name}</h3>

      <div className="machine-load">
        <div className="load-label">
          <span>Current load</span>
          <strong>{load}</strong>
        </div>

        <div className="load-bar">
          <div
            className={`load-progress ${status.toLowerCase()}`}
            style={{ width: load }}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
