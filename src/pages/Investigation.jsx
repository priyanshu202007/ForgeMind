import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Search,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { assessIncident } from "../services/api";

function Investigation() {
  const navigate = useNavigate();
  const [assessmentStatus, setAssessmentStatus] = useState(
    "Assessing incident with the backend..."
  );

  useEffect(() => {
    assessIncident("INC-1025")
      .then(() => setAssessmentStatus("Backend assessment received."))
      .catch(() =>
        setAssessmentStatus(
          "Backend assessment unavailable. Showing local investigation data."
        )
      );
  }, []);

  return (
    <div className="investigation-page">
      <button
        className="back-button"
        onClick={() => navigate("/report-incident")}
      >
        <ArrowLeft size={16} />
        Back to incident
      </button>

      <div className="investigation-header">
        <div>
          <div className="eyebrow">
            FACTORY MEMORY · AI INVESTIGATION
          </div>

          <h1>Investigating incident INC-1025</h1>

          <p>
            Factory Memory is searching previous operational
            experiences for relevant evidence.
          </p>
        </div>

        <div className="ai-status">
          <Sparkles size={15} />
          AI investigation active
        </div>
      </div>

      <div className="investigation-grid">
        <section className="panel investigation-main">
          <div className="panel-header">
            <div>
              <h2>Incident understanding</h2>
              <p>Current incident context</p>
            </div>

            <BrainCircuit size={20} />
          </div>

          <div className="incident-summary">
            <div>
              <span>Machine</span>
              <strong>CNC-04</strong>
            </div>

            <div>
              <span>Issue</span>
              <strong>Excessive vibration</strong>
            </div>

            <div>
              <span>Error code</span>
              <strong>SP-881</strong>
            </div>

            <div>
              <span>Severity</span>
              <strong className="high-text">High</strong>
            </div>
          </div>

          <div className="investigation-section">
            <div className="section-title">
              <Search size={16} />
              Searching Factory Memory
            </div>

            <div className="search-status">
              <div className="status-dot" />

              <span>{assessmentStatus}</span>
            </div>
          </div>

          <div className="investigation-section">
            <div className="section-title">
              <BrainCircuit size={16} />
              Relevant memories
            </div>

            <MemoryResult
              incident="INC-0871"
              machine="CNC-02"
              issue="Excessive spindle vibration"
              similarity="94%"
              resolution="Spindle bearing alignment and lubrication"
            />

            <MemoryResult
              incident="INC-0642"
              machine="CNC-04"
              issue="Abnormal vibration during high RPM"
              similarity="89%"
              resolution="Checked spindle mount and corrected alignment"
            />

            <MemoryResult
              incident="INC-0519"
              machine="LATHE-03"
              issue="High-frequency machine vibration"
              similarity="81%"
              resolution="Replaced worn bearing assembly"
            />
          </div>
        </section>

        <aside className="panel recommendation-panel">
          <div className="panel-header">
            <div>
              <h2>AI investigation</h2>
              <p>Evidence-based reasoning</p>
            </div>

            <Sparkles size={19} />
          </div>

          <div className="recommendation-content">
            <div className="recommendation-label">
              POSSIBLE ROOT CAUSE
            </div>

            <h3>
              Spindle alignment or bearing-related vibration
            </h3>

            <p>
              Previous incidents with similar symptoms were resolved
              after inspecting spindle alignment, mounting condition
              and bearing wear.
            </p>

            <div className="confidence">
              <span>Evidence confidence</span>
              <strong>92%</strong>
            </div>

            <div className="confidence-bar">
              <div style={{ width: "92%" }} />
            </div>

            <div className="recommended-action">
              <CheckCircle2 size={18} />

              <div>
                <strong>Suggested investigation</strong>

                <p>
                  Inspect spindle alignment and bearing condition
                  before replacing components.
                </p>
              </div>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/resolution")}
            >
              Continue to resolution
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MemoryResult({
  incident,
  machine,
  issue,
  similarity,
  resolution,
}) {
  return (
    <div className="memory-result">
      <div className="memory-result-top">
        <span>
          {incident} · {machine}
        </span>

        <strong>{similarity} match</strong>
      </div>

      <h3>{issue}</h3>

      <p>
        Previous resolution: {resolution}
      </p>
    </div>
  );
}

export default Investigation;