type DashboardCardProps = {
  count: number | string;
  label: string;
  icon: React.ReactElement;
  clickEvent?: () => void;
};

export const DashboardHeaderCard = ({
  count,
  label,
  icon,
  clickEvent,
}: DashboardCardProps) => {
  return (
    <div className="card stat-card">
      <div
        className="card-body"
        style={{ cursor: "pointer" }}
        onClick={clickEvent}
      >
        <div className="stat-icon">{icon}</div>
        <div className="stat-details">
          <h3 className="stat-value">{count}</h3>
          <p className="stat-label">{label}</p>
          <div className="stat-change no-change">
            <i className="bi bi-dash"></i> No change
          </div>
        </div>
      </div>
    </div>
  );
};
