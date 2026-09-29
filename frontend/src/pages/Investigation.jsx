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

      <div className="investigation-flow" aria-label="Investigation workflow">
        <span className="investigation-flow-step current">Current incident</span>
        <span className="investigation-flow-arrow" aria-hidden="true">→</span>
        <span className="investigation-flow-step memory">Hindsight retrieves</span>
        <span className="investigation-flow-arrow" aria-hidden="true">→</span>
        <span className="investigation-flow-step evidence">Historical evidence</span>
        <span className="investigation-flow-arrow" aria-hidden="true">→</span>
        <span className="investigation-flow-step reasoning">AI recommendations</span>
      </div>

      <div className="investigation-grid">
        <section className="panel investigation-main">
          <div className="panel-header">
            <div>
              <span className="investigation-kicker">CURRENT INCIDENT</span>
              <h2>Incident context</h2>
              <p>Reported details used for this investigation</p>
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
            <div className="evidence-heading">
              <div>
                <span className="investigation-kicker">HISTORICAL EVIDENCE</span>
                <h2>Relevant memories</h2>
              </div>
              <span className="hindsight-memory-label">
                <BrainCircuit size={13} />
                HINDSIGHT MEMORY
              </span>
            </div>

            <div className="search-status">
              <Search size={15} />

              <span>
                {result.memory?.retrievedCount || 0} historical memories retrieved
              </span>
            </div>
          </div>

          <div className="investigation-section historical-evidence-list">
            {historicalEvidence.length === 0 ? (
              <div className="memory-result evidence-empty-state">
                <Search size={20} />
                <h3>No historical evidence found</h3>
                <p>
                  No relevant historical memory was retrieved for this incident.
                  The investigation summary below is shown without a matching
                  memory card.
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
              <span className="investigation-kicker">AI REASONING</span>
              <h2>Investigation</h2>
              <p>Summary and recommended next steps</p>
            </div>

            <Sparkles size={19} />
          </div>

          <div className="recommendation-content">
            <div className="recommendation-label">
              INVESTIGATION SUMMARY
            </div>

            <h3>{result.summary}</h3>

            <div className="confidence">
              <span>Historical memories retrieved</span>
              <strong>{historicalEvidence.length}</strong>
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
  const hasRelevance = typeof memory.relevance === "number";

  return (
    <article className="memory-result">
      <div className="memory-result-top">
        <span>
          {memory.type || "memory"} · {memory.memoryId}
        </span>

        {hasRelevance && (
          <strong>{memory.relevance.toFixed(2)} relevance</strong>
        )}
      </div>

      <h3>{memory.summary || "Historical memory"}</h3>

      {memory.source && (
        <p className="memory-source">Source: {memory.source}</p>
      )}
    </article>
  );
}

export default Investigation;
