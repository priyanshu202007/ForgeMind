import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";
import { analyzeIncident } from "../services/api";

function ReportIncident() {
  const navigate = useNavigate();

  const [machineId, setMachineId] = useState("");
  const [title, setTitle] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleInvestigate() {
    setError("");

    if (!machineId || !title || !severity || !description) {
      setError("Please complete machine, issue, severity, and symptoms.");
      return;
    }

    setLoading(true);

    try {
      const result = await analyzeIncident({
        incidentId: `UI-${Date.now()}`,
        machineId,
        timestamp: new Date().toISOString(),
        title,
        description: `${description}${errorCode ? ` Error code: ${errorCode}.` : ""}`,
      });

      navigate("/investigation", {
        state: {
          incident: {
            machineId,
            title,
            errorCode,
            severity,
            description,
          },
          result,
        },
      });
    } catch (err) {
      setError(err.message || "Investigation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="incident-page">
      <div className="incident-page-header">
        <div>
          <div className="eyebrow">INCIDENT MANAGEMENT</div>

          <h1>Report a factory incident</h1>

          <p>
            Capture the symptoms and machine context so Factory Memory
            can investigate the issue.
          </p>
        </div>
      </div>

      <div className="incident-layout">
        <section className="panel incident-form-panel">
          <div className="panel-header">
            <div>
              <h2>Incident details</h2>
              <p>Provide the information observed on the factory floor.</p>
            </div>

            <AlertTriangle size={20} />
          </div>

          <div className="form-content">
            <label>
              Machine
              <select
                value={machineId}
                onChange={(event) => setMachineId(event.target.value)}
              >
                <option value="">Select machine</option>
                <option value="CNC-01">CNC-01</option>
                <option value="CNC-02">CNC-02</option>
                <option value="PRESS-01">PRESS-01</option>
                <option value="COOL-01">COOL-01</option>
                <option value="CONV-01">CONV-01</option>
              </select>
            </label>

            <label>
              Issue / symptom
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Spindle overheating"
              />
            </label>

            <label>
              Error code
              <input
                type="text"
                value={errorCode}
                onChange={(event) => setErrorCode(event.target.value)}
                placeholder="e.g. SP-881"
              />
            </label>

            <label>
              Severity
              <select
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
              >
                <option value="">Select severity</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </label>

            <label>
              Observed symptoms
              <textarea
                rows="5"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what the operator observed..."
              />
            </label>

            {error ? (
              <div className="memory-note">
                <AlertTriangle size={17} />
                <span>{error}</span>
              </div>
            ) : null}

            <button
              className="investigate-button"
              onClick={handleInvestigate}
              disabled={loading}
            >
              <BrainCircuit size={17} />
              {loading
                ? "Investigating with Factory Memory..."
                : "Investigate with Factory Memory"}
            </button>
          </div>
        </section>

        <aside className="panel memory-preview">
          <div className="panel-header">
            <div>
              <h2>What happens next?</h2>
              <p>Factory Memory investigation flow</p>
            </div>

            <BrainCircuit size={20} />
          </div>

          <div className="flow-list">
            <FlowStep
              number="01"
              title="Understand the incident"
              text="AI processes the machine, symptoms and error details."
            />

            <FlowStep
              number="02"
              title="Search factory memory"
              text="Hindsight retrieves similar incidents and previous resolutions."
            />

            <FlowStep
              number="03"
              title="Generate investigation"
              text="Relevant evidence is presented with possible root causes."
            />

            <FlowStep
              number="04"
              title="Save the outcome"
              text="The final resolution becomes a new factory memory."
            />
          </div>

          <div className="memory-note">
            <CheckCircle2 size={17} />
            <span>
              Every resolved incident helps the factory learn.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FlowStep({ number, title, text }) {
  return (
    <div className="flow-step">
      <div className="flow-number">{number}</div>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default ReportIncident;
