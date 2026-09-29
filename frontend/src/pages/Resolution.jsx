import {
  ArrowLeft,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Save,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { retainOutcome } from "../services/api";

function Resolution() {
  const navigate = useNavigate();
  const location = useLocation();

  const incident = location.state?.incident;
  const result = location.state?.result;

  const [rootCause, setRootCause] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [outcome, setOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!incident || !result) {
    return (
      <div className="resolution-page">
        <button
          className="back-button"
          onClick={() => navigate("/report-incident")}
        >
          <ArrowLeft size={16} />
          Back to incident
        </button>

        <section className="panel">
          <h2>No resolution data</h2>
          <p>Start from the incident report page.</p>

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

  const suggestedCause =
    result.historicalEvidence?.[0]?.summary ||
    "Review the historical evidence before confirming the root cause.";

  async function handleSave() {
    setError("");

    if (!actionTaken || !outcome) {
      setError("Please enter the action taken and select an outcome.");
      return;
    }

    setSaving(true);

    try {
      await retainOutcome({
        incidentId: result.incidentId,
        actionTaken: `${rootCause ? `Root cause: ${rootCause}. ` : ""}${actionTaken}`,
        result: outcome,
        resolutionStatus: outcome,
        notes,
      });

      setSaved(true);
    } catch (err) {
      setError(err.message || "Failed to save resolution.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="resolution-page">
      <button
        className="back-button"
        onClick={() =>
          navigate("/investigation", {
            state: { incident, result },
          })
        }
      >
        <ArrowLeft size={16} />
        Back to investigation
      </button>

      <div className="resolution-header">
        <div>
          <div className="eyebrow">INCIDENT RESOLUTION</div>

          <h1>Resolve incident {result.incidentId}</h1>

          <p>
            Record what was done and help Factory Memory learn from
            the outcome.
          </p>
        </div>

        <div className="resolved-badge">
          <CheckCircle2 size={15} />
          {saved ? "Resolution saved" : "Resolution in progress"}
        </div>
      </div>

      <div className="resolution-loop" aria-label="Resolution learning loop">
        <span>AI evidence</span>
        <span aria-hidden="true">→</span>
        <span>Engineer action</span>
        <span aria-hidden="true">→</span>
        <span>Observed outcome</span>
        <span aria-hidden="true">→</span>
        <span>Future factory memory</span>
      </div>

      <div className="resolution-grid">
        <section className="panel resolution-form-panel">
          <div className="panel-header">
            <div>
              <h2>Resolution details</h2>
              <p>Capture the action taken by the operator.</p>
            </div>

            <CheckCircle2 size={20} />
          </div>

          <div className="resolution-form">
            <div className="resolution-summary">
              <div>
                <span>Incident</span>
                <strong>{result.incidentId}</strong>
              </div>

              <div>
                <span>Machine</span>
                <strong>{incident.machineId}</strong>
              </div>

              <div>
                <span>Issue</span>
                <strong>{incident.title}</strong>
              </div>

              <div className="resolution-summary-evidence">
                <span>Suggested evidence</span>
                <strong>{suggestedCause}</strong>
              </div>
            </div>

            <label className="resolution-field cause-field">
              Root cause confirmed
              <select
                value={rootCause}
                onChange={(event) => setRootCause(event.target.value)}
              >
                <option value="">Select confirmed cause</option>
                <option value="Partially blocked coolant filter">
                  Partially blocked coolant filter
                </option>
                <option value="Reduced coolant flow">
                  Reduced coolant flow
                </option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="resolution-field action-field">
              Action taken
              <textarea
                rows="5"
                value={actionTaken}
                onChange={(event) => setActionTaken(event.target.value)}
                placeholder="Describe the repair or corrective action..."
              />
            </label>

            <label className="resolution-field outcome-field">
              Outcome
              <select
                value={outcome}
                onChange={(event) => setOutcome(event.target.value)}
              >
                <option value="">Select outcome</option>
                <option value="resolved">Successfully resolved</option>
                <option value="partially_resolved">
                  Partially resolved
                </option>
                <option value="unresolved">Not resolved</option>
              </select>
            </label>

            <label className="resolution-field notes-field">
              Operator notes
              <textarea
                rows="4"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add observations that may help with future incidents..."
              />
            </label>

            {error ? (
              <div className="memory-note resolution-error-state">
                <AlertTriangle size={17} />
                <span>{error}</span>
              </div>
            ) : null}

            {!saved ? (
              <button
                className="save-resolution-button"
                onClick={handleSave}
                disabled={saving}
              >
                <Save size={17} />
                {saving
                  ? "Saving to Factory Memory..."
                  : "Save resolution to Factory Memory"}
              </button>
            ) : (
              <div className="save-success">
                <CheckCircle2 size={18} />

                <div>
                  <strong>Resolution saved successfully</strong>

                  <p>
                    This outcome has been retained in Hindsight for
                    future investigations.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="panel learning-panel">
          <div className="panel-header">
            <div>
              <span className="resolution-memory-kicker">LEARNING LOOP</span>
              <h2>Factory Memory learning loop</h2>
              <p>Review what this resolution contributes</p>
            </div>

            <BrainCircuit size={20} />
          </div>

          <div className="learning-content">
            <div className="learning-icon">
              <BrainCircuit size={25} />
            </div>

            <h3>Turn this incident into experience</h3>

            <p>
              Once saved, this outcome becomes searchable experience
              for future investigations.
            </p>

            <div className="learning-flow">
              <LearningStep
                title="Incident"
                text={`${incident.machineId} · ${incident.title}`}
              />

              <LearningStep
                title="Evidence"
                text={`${result.memory?.retrievedCount || 0} Hindsight memories`}
              />

              <LearningStep
                title="Resolution"
                text={actionTaken || "Waiting for operator action"}
              />

              <LearningStep
                title="Outcome"
                text={outcome || "Waiting for outcome"}
              />
            </div>

            <div className="memory-growth">
              <span>Factory Memory</span>

              <strong>
                {result.memory?.retrievedCount || 0}{" "}
                <small>historical memories used</small>
              </strong>

              <p>
                The saved outcome becomes future searchable experience.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function LearningStep({ title, text }) {
  return (
    <div className="learning-step">
      <CheckCircle2 size={15} />

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

export default Resolution;
