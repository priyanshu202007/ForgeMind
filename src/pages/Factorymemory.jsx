import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Search,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { searchIncidents } from "../services/api";

const fallbackMemories = [
  {
    incident: "INC-1025",
    machine: "CNC-04",
    issue: "Excessive vibration",
    cause: "Spindle misalignment",
    resolution: "Spindle alignment corrected",
    status: "New memory",
  },
  {
    incident: "INC-1023",
    machine: "PRESS-02",
    issue: "Hydraulic pressure drop",
    cause: "Worn pressure seal",
    resolution: "Seal replaced and pressure restored",
    status: "Resolved",
  },
  {
    incident: "INC-1021",
    machine: "ROBOT-07",
    issue: "Gripper alignment",
    cause: "Loose actuator mount",
    resolution: "Mount tightened and alignment recalibrated",
    status: "Resolved",
  },
  {
    incident: "INC-1017",
    machine: "CNC-02",
    issue: "Spindle vibration",
    cause: "Bearing wear",
    resolution: "Bearing assembly replaced",
    status: "Resolved",
  },
];

function FactoryMemory() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [memories, setMemories] = useState(fallbackMemories);
  const [apiError, setApiError] = useState("");

  const handleSearch = async () => {
    const query = searchTerm.trim();

    if (!query) {
      setMemories(fallbackMemories);
      setApiError("");
      return;
    }

    try {
      const results = await searchIncidents({
        query,
        machine_id: null,
        severity: null,
        limit: 5,
      });

      if (!Array.isArray(results)) {
        throw new Error("Unexpected incident search response.");
      }

      setMemories(
        results.map((incident) => ({
          incident: incident.incident_id,
          machine: incident.machine_id,
          issue: incident.defect,
          cause: incident.root_cause || "Not recorded",
          resolution: incident.resolution || "Not recorded",
          status: incident.outcome || "Historical incident",
        }))
      );
      setApiError("");
    } catch (error) {
      setMemories(fallbackMemories);
      setApiError(error.message);
    }
  };

  const filteredMemories = memories.filter((memory) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      memory.incident.toLowerCase().includes(search) ||
      memory.machine.toLowerCase().includes(search) ||
      memory.issue.toLowerCase().includes(search) ||
      memory.cause.toLowerCase().includes(search) ||
      memory.resolution.toLowerCase().includes(search)
    );
  });

  return (
    <div className="memory-page">
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={16} />
        Back to overview
      </button>

      <div className="memory-page-header">
        <div>
          <div className="eyebrow">
            FACTORY INTELLIGENCE · MEMORY
          </div>

          <h1>Factory Memory</h1>

          <p>
            Operational experiences collected from previous
            incidents and resolutions.
          </p>
        </div>

        <div className="memory-live-badge">
          <BrainCircuit size={15} />
          Memory active
        </div>
      </div>

      <section className="memory-hero panel">
        <div className="memory-hero-icon">
          <BrainCircuit size={30} />
        </div>

        <div className="memory-hero-content">
          <span>Total operational experiences</span>

          <strong>1,285</strong>

          <p>
            Every resolved incident becomes knowledge that can
            help investigate future factory problems.
          </p>
        </div>

        <div className="memory-hero-stats">
          <div>
            <strong>92%</strong>
            <span>Retrieval relevance</span>
          </div>

          <div>
            <strong>86%</strong>
            <span>Resolution success</span>
          </div>

          <div>
            <strong>26</strong>
            <span>Added this week</span>
          </div>
        </div>
      </section>

      <div className="memory-search panel">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search factory memories..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <button
          className="secondary-button"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <section className="panel memory-history-panel">
        <div className="panel-header">
          <div>
            <h2>Recent operational memories</h2>

            <p>
              {searchTerm
                ? `${filteredMemories.length} memories matching "${searchTerm}"`
                : "Resolved incidents that can be reused as evidence."}
            </p>
          </div>

          <Sparkles size={20} />
        </div>

        {apiError && <p>{`Live search unavailable: ${apiError}`}</p>}

        {filteredMemories.length > 0 ? (
          filteredMemories.map((memory) => (
            <MemoryCard
              key={memory.incident}
              incident={memory.incident}
              machine={memory.machine}
              issue={memory.issue}
              cause={memory.cause}
              resolution={memory.resolution}
              similarity={memory.status}
            />
          ))
        ) : (
          <div className="memory-empty-state">
            <Search size={22} />

            <strong>No matching memories found</strong>

            <p>
              Try searching by machine, incident, symptom,
              root cause or resolution.
            </p>
          </div>
        )}
      </section>

      <section className="memory-insight-panel panel">
        <div className="memory-insight-icon">
          <BrainCircuit size={20} />
        </div>

        <div>
          <strong>Factory Memory is continuously learning</strong>

          <p>
            New resolutions are stored as operational experiences
            so future incidents can be investigated using evidence
            from what happened before.
          </p>
        </div>

        <CheckCircle2 size={20} />
      </section>
    </div>
  );
}

function MemoryCard({
  incident,
  machine,
  issue,
  cause,
  resolution,
  similarity,
}) {
  return (
    <div className="memory-history-card">
      <div className="memory-card-left">
        <div className="memory-card-icon">
          <BrainCircuit size={17} />
        </div>

        <div>
          <span>
            {incident} · {machine}
          </span>

          <h3>{issue}</h3>

          <p>
            <strong>Root cause:</strong> {cause}
          </p>

          <p>
            <strong>Resolution:</strong> {resolution}
          </p>
        </div>
      </div>

      <div className="memory-card-status">
        <CheckCircle2 size={15} />
        {similarity}
      </div>
    </div>
  );
}

export default FactoryMemory;