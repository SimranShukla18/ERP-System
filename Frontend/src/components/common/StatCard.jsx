export default function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className={`text-xl font-bold ${color ? `text-${color}` : "text-text"}`}>
          {value}
        </div>
        <div className="text-xs text-muted mt-0.5">{label}</div>
      </div>
    </div>
  );
}