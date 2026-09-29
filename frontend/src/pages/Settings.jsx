import {
  ArrowLeft,
  Settings as SettingsIcon,
  Factory,
  BrainCircuit,
  Bell,
  ShieldCheck,
  Database,
  CheckCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Settings() {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="settings-page">
      <button
      
  className="save-settings-button"
  onClick={handleSave}
>
  <CheckCircle2 size={17} />

  {saved
    ? "Configuration saved"
    : "Save configuration"}
</button>
      <div className="settings-header">
        <div>
          <div className="eyebrow">
            SYSTEM CONFIGURATION · SETTINGS
          </div>

          <h1>Factory Settings</h1>

          <p>
            Configure factory information, memory behavior and
            operational system preferences.
          </p>
        </div>

        <div className="settings-live-badge">
          <SettingsIcon size={15} />
          Configuration
        </div>
      </div>

      <div className="settings-layout">
        <section className="panel settings-main-panel">
          <div className="panel-header">
            <div>
              <h2>Factory configuration</h2>

              <p>
                Basic information used by Factory Memory.
              </p>
            </div>

            <Factory size={20} />
          </div>

          <div className="settings-form">
            <label>
              Factory name

              <input
                type="text"
                defaultValue="Atlas Manufacturing"
              />
            </label>

            <label>
              Plant location

              <input
                type="text"
                defaultValue="Hyderabad Plant · 01"
              />
            </label>

            <label>
              Operations team

              <input
                type="text"
                defaultValue="Plant Operations"
              />
            </label>

            <label>
              Factory Memory

              <select defaultValue="active">
                <option value="active">
                  Active
                </option>

                <option value="paused">
                  Paused
                </option>
              </select>
            </label>

            <button
              className="save-settings-button"
              onClick={handleSave}
            >
              <CheckCircle2 size={17} />

              {saved
                ? "Configuration saved"
                : "Save configuration"}
            </button>
          </div>
        </section>

        <aside className="settings-side">
          <SettingsCard
            icon={<BrainCircuit size={19} />}
            title="Factory Memory"
            description="Operational experiences and incident knowledge."
            status="Active"
          />

          <SettingsCard
            icon={<Bell size={19} />}
            title="Incident alerts"
            description="Notifications for high-priority factory incidents."
            status="Enabled"
          />

          <SettingsCard
            icon={<ShieldCheck size={19} />}
            title="System security"
            description="Factory data and operational access controls."
            status="Protected"
          />

          <SettingsCard
            icon={<Database size={19} />}
            title="Memory storage"
            description="Incident and resolution experience storage."
            status="Connected"
          />
        </aside>
      </div>
    </div>
  );
}

function SettingsCard({
  icon,
  title,
  description,
  status,
}) {
  return (
    <div className="settings-card">
      <div className="settings-card-icon">
        {icon}
      </div>

      <div className="settings-card-content">
        <strong>{title}</strong>

        <p>{description}</p>

        <span>
          <CheckCircle2 size={13} />
          {status}
        </span>
      </div>
    </div>
  );
}

export default Settings;