import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Save,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Resolution() {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <div className="resolution-page">
      <button
        className="back-button"
        onClick={() => navigate("/investigation")}
      >
        <ArrowLeft size={16} />
        Back to investigation
      </button>

      <div className="resolution-header">
        <div>
          <div className="eyebrow">INCIDENT RESOLUTION</div>

          <h1>Resolve incident INC-1025</h1>

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

      <div className="resolution-grid">
        <section className="panel resolution-form-panel">
          <div className="panel-header">
            <div>
              <h2>Resolution details</h2>

              <p>
                Capture the action taken by the operator.
              </p>
            </div>

            <CheckCircle2 size={20} />
          </div>

          <div className="resolution-form">
            <div className="resolution-summary">
              <div>
                <span>Incident</span>
                <strong>INC-1025</strong>
              </div>

              <div>
                <span>Machine</span>
                <strong>CNC-04</strong>
              </div>

              <div>
                <span>Suggested cause</span>
                <strong>
                  Spindle alignment / bearing
                </strong>
              </div>
            </div>

            <label>
              Root cause confirmed

              <select>
                <option>Select confirmed cause</option>
                <option>Spindle misalignment</option>
                <option>Worn spindle bearing</option>
                <option>Loose spindle mount</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Action taken

              <textarea
                rows="5"
                placeholder="Describe the repair or corrective action..."
              />
            </label>

            <label>
              Outcome

              <select>
                <option>Select outcome</option>
                <option>Successfully resolved</option>
                <option>Partially resolved</option>
                <option>Not resolved</option>
              </select>
            </label>

            <label>
              Operator notes

              <textarea
                rows="4"
                placeholder="Add observations that may help with future incidents..."
              />
            </label>

            {!saved ? (
              <button
                className="save-resolution-button"
                onClick={handleSave}
              >
                <Save size={17} />
                Save resolution to Factory Memory
              </button>
            ) : (
              <div className="save-success">
                <CheckCircle2 size={18} />

                <div>
                  <strong>Resolution saved successfully</strong>

                  <p>
                    This incident has been added as a new
                    Factory Memory experience.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="panel learning-panel">
          <div className="panel-header">
            <div>
              <h2>Memory update</h2>

              <p>
                What Factory Memory will learn
              </p>
            </div>

            <BrainCircuit size={20} />
          </div>

          <div className="learning-content">
            <div className="learning-icon">
              <BrainCircuit size={25} />
            </div>

            <h3>
              Turn this incident into experience
            </h3>

            <p>
              Once the resolution is confirmed, this incident
              becomes a new operational experience for future
              investigations.
            </p>

            <div className="learning-flow">
              <LearningStep
                title="Incident"
                text="CNC-04 vibration"
              />

              <LearningStep
                title="Cause"
                text="Spindle alignment"
              />

              <LearningStep
                title="Resolution"
                text="Alignment corrected"
              />

              <LearningStep
                title="Outcome"
                text="Successfully resolved"
              />
            </div>

            <div className="memory-growth">
              <span>Factory Memory</span>

              <strong>
                1,284 <small>→</small> 1,285
              </strong>

              <p>
                operational experiences
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