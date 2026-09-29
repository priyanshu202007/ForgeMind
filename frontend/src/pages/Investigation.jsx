import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Search,
  Sparkles,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

function Investigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const incident = location.state?.incident;
  const result = location.state?.result;

  if (!incident || !result) {
    return (
      <div className="investigation-page">
        <button
          className="back-button"
          onClick={() => navigate("/report-incident")}
        >
          <ArrowLeft size={16} />
          Back to incident
        </button>

        <section className="panel investigation-main">
          <div className="panel-header">
            <div>
              <h2>No investigation data</h2>
              <p>Start from the incident report page.</p>
            </div>

            <BrainCircuit size={20} />
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/report-incident")}
          >
            Report an incident
          </button>
        </section>
      </div>
    );
  }

  const historicalEvidence = result.historicalEvidence || [];
  const recommendations = result.recommendations || [];

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

          <h1>
            Investigating {incident.title || "factory incident"}
          </h1>

          <p>
            Factory Memory searched historical operational experiences
            and generated an evidence-backed investigation.
          </p>
        </div>

        <div className="ai-status">
          <Sparkles size={15} />
          Hindsight memory active
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
              <strong>{incident.machineId}</strong>
            </div>

            <div>
              <span>Issue</span>
              <strong>{incident.title}</strong>
            </div>

            <div>
              <span>Error code</span>
              <strong>{incident.errorCode || "—"}</strong>
            </div>

            <div>
              <span>Severity</span>
              <strong className="high-text">
                {incident.severity}
              </strong>
            </div>
          </div>

          <div className="investigation-section">
            <div className="section-title">
              <Search size={16} />
              Searching Factory Memory
            </div>

            <div className="search-status">
              <div className="status-dot" />

              <span>
                Retrieved {result.memory?.retrievedCount || 0} historical
                memories from Hindsight.
              </span>
            </div>
          </div>

          <div className="investigation-section">
            <div className="section-title">
              <BrainCircuit size={16} />
              Relevant memories
            </div>

            {historicalEvidence.length === 0 ? (
              <div className="memory-result">
                <h3>No historical evidence found</h3>
                <p>
                  Hindsight did not return matching historical evidence
                  for this incident.
                </p>
              </div>
            ) : (
              historicalEvidence.map((memory) => (
                <MemoryResult
                  key={memory.memoryId}
                  memory={memory}
                />
              ))
            )}
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
              HISTORICAL ANALYSIS
            </div>

            <h3>{result.summary}</h3>

            <div className="confidence">
              <span>Historical memories retrieved</span>
              <strong>{historicalEvidence.length}</strong>
            </div>

            <div className="confidence-bar">
              <div
                style={{
                  width: `${Math.min(
                    historicalEvidence.length * 30,
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="recommended-action">
              <CheckCircle2 size={18} />

              <div>
                <strong>Recommended investigation</strong>

                {recommendations.length === 0 ? (
                  <p>
                    Review the historical evidence before taking
                    corrective action.
                  </p>
                ) : (
                  <ol>
                    {recommendations.slice(0, 4).map((item) => (
                      <li key={item.step}>
                        <strong>{item.action}</strong>{" "}
                        {item.reason}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                navigate("/resolution", {
                  state: {
                    incident,
                    result,
                  },
                })
              }
            >
              Continue to resolution
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MemoryResult({ memory }) {
  const score =
    typeof memory.relevance === "number"
      ? memory.relevance.toFixed(2)
      : "Historical";

  return (
    <div className="memory-result">
      <div className="memory-result-top">
        <span>
          {memory.type || "memory"} · {memory.memoryId}
        </span>

        <strong>{score} relevance</strong>
      </div>

      <h3>{memory.summary}</h3>

      <p>
        Source: {memory.source || "hindsight"}
      </p>
    </div>
  );
}

export default Investigation;
