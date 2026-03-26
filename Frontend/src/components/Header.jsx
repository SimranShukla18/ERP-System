import { useApp } from "../context/AppContext";

const titles = {
  suppliers: "Supplier Master",
  "add-supplier": "Add Supplier",
  purchases: "Purchase Register",
  "add-purchase": "Add Purchase",
  payments: "Record Payment",
  ledger: "Supplier Ledger",
  invoice: "Purchase Invoice",
};

export default function Header() {
  const { page } = useApp();

  return (
    <header className="bg-surface border-b border-border px-8 py-5 flex justify-between items-center">
      <div>
        <h1 className="font-playfair text-2xl text-text font-semibold">
          {titles[page] || "Dashboard"}
        </h1>
        <div className="text-xs text-muted mt-1">Home / {titles[page]}</div>
      </div>
      <div className="flex gap-3 items-center">
        <div className="bg-surface2 border border-border rounded-full px-4 py-1.5 text-xs text-muted">
          Mumbai, India
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-amber-700 flex items-center justify-center text-xs font-semibold text-black">
          RA
        </div>
      </div>
    </header>
  );
}