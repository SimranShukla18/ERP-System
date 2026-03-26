export default function Field({ label, error, children, inline }) {
  return (
    <div className={inline ? "flex items-center gap-3" : "flex flex-col gap-1.5 mb-4"}>
      <label className="text-xs text-muted font-medium uppercase tracking-wider">
        {label}
      </label>
      {children}
      {error && <div className="text-xs text-red">{error}</div>}
    </div>
  );
}