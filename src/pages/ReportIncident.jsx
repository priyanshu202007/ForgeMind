
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";

function ReportIncident() {
  const navigate = useNavigate();

  return (
    <div className="incident-page">
   <button
  className="investigate-button"
  onClick={() => navigate("/investigation")}
>
  <BrainCircuit size={17} />
  Investigate with Factory Memory
</button>

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
              <select>
                <option>Select machine</option>
                <option>CNC-04</option>
                <option>PRESS-02</option>
                <option>LATHE-03</option>
                <option>ROBOT-07</option>
              </select>
            </label>

            <label>
              Issue / symptom
              <input
                type="text"
                placeholder="e.g. Excessive vibration"
              />
            </label>

            <label>
              Error code
              <input
                type="text"
                placeholder="e.g. SP-881"
              />
            </label>

            <label>
              Severity
              <select>
                <option>Select severity</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>

            <label>
              Observed symptoms
              <textarea
                rows="5"
                placeholder="Describe what the operator observed..."
              />
            </label>

            <button className="investigate-button">
              <BrainCircuit size={17} />
              Investigate with Factory Memory
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