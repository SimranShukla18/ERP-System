import { useApp } from "../context/AppContext";

const NAV = [
  { id: "suppliers", icon: "👥", label: "Suppliers" },
  { id: "purchases", icon: "📦", label: "Purchases" },
  { id: "payments", icon: "💰", label: "Payments" },
  { id: "ledger", icon: "📒", label: "Ledger" },
];

export default function Sidebar() {
  const { page, setPage } = useApp();

  const isActive = (navId) =>
    page === navId ||
    (navId === "suppliers" && page === "add-supplier") ||
    (navId === "purchases" && (page === "add-purchase" || page === "invoice"));

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-border flex flex-col z-10">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <span className="text-3xl text-accent leading-none">◆</span>
        <div>
          <div className="font-playfair text-lg text-accent font-semibold">
            GoldERP
          </div>
          <div className="text-xs text-muted">Jewellery Management</div>
        </div>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-muted hover:bg-surface2 hover:text-text transition-colors ${
              isActive(n.id) ? "bg-accent/15 text-accent font-medium" : ""
            }`}
          >
            <span className="text-lg w-6 text-center">{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 text-xs text-muted border-t border-border">
        v1.0 · Jewellery ERP
      </div>
    </aside>
  );
}