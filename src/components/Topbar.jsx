import {
  ChevronRight,
  CircleCheck,
} from "lucide-react";

function Topbar({ currentPage = "Overview" }) {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Atlas Manufacturing</span>
        <ChevronRight size={14} />
        <strong>{currentPage}</strong>
      </div>

      <div className="topbar-right">
        <div className="system-status">
          <CircleCheck size={14} />
          <span>Systems operational</span>
        </div>

        <div className="plant-info">
          Hyderabad Plant · 01
        </div>

        <div className="user-avatar-small">
          RK
        </div>
      </div>
    </header>
  );
}

export default Topbar;