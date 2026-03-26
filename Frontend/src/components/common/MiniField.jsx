export default function MiniField({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted font-medium">{label}</div>
      {children}
    </div>
  );
}