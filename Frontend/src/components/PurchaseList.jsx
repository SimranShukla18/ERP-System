import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { fmt } from "../utils/helpers";
import StatCard from "./common/StatCard";

export default function PurchaseList() {
  const { purchases, suppliers, setModal, setPage } = useApp();
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const list = useMemo(() => {
    return purchases.filter((p) => {
      const s = suppliers.find((x) => x.id === p.supplierId);
      const q = search.toLowerCase();
      const match =
        !q ||
        (s?.name || "").toLowerCase().includes(q) ||
        p.invoiceNo.toLowerCase().includes(q);
      const after = !dateFrom || p.date >= dateFrom;
      const before = !dateTo || p.date <= dateTo;
      return match && after && before;
    });
  }, [purchases, suppliers, search, dateFrom, dateTo]);

  const totalValue = purchases.reduce((a, p) => a + p.total, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => {
            setModal(null);
            setPage("add-purchase");
          }}
          className="bg-accent hover:bg-amber-500 text-black font-semibold px-4 py-2 rounded-lg transition-all"
        >
          ➕ Add Purchase
        </button>
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2 min-w-[260px]">
          <span>🔍</span>
          <input
            placeholder="Search supplier, invoice…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none flex-1 focus:outline-none text-text"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-2 text-text"
          />
          <span className="text-muted">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-2 text-text"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon="📦" label="Total Purchases" value={purchases.length} />
        <StatCard
          icon="✅"
          label="Paid"
          value={purchases.filter((p) => p.status === "PAID").length}
          color="green"
        />
        <StatCard
          icon="⏳"
          label="Pending"
          value={purchases.filter((p) => p.status !== "PAID").length}
          color="orange"
        />
        <StatCard
          icon="💰"
          label="Total Value"
          value={fmt(totalValue)}
          color="accent2"
        />
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface2 text-muted text-xs font-medium uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Supplier</th>
              <th className="px-4 py-3 text-left">Invoice No</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Paid</th>
              <th className="px-4 py-3 text-left">Balance</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-muted">
                  No purchases found
                </td>
              </tr>
            )}
            {list.map((p) => {
              const s = suppliers.find((x) => x.id === p.supplierId);
              return (
                <tr
                  key={p.id}
                  className="border-b border-border hover:bg-white/5 last:border-none"
                >
                  <td className="px-4 py-3 font-mono text-sm">{p.date}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-text">{s?.name || "—"}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-accent">
                    {p.invoiceNo}
                  </td>
                  <td className="px-4 py-3">{fmt(p.total)}</td>
                  <td className="px-4 py-3 text-green">{fmt(p.paid)}</td>
                  <td
                    className={`px-4 py-3 ${
                      p.balance > 0 ? "text-red" : "text-green"
                    }`}
                  >
                    {fmt(p.balance)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                        p.status === "PAID"
                          ? "bg-green/20 text-green"
                          : p.status === "PARTIAL"
                          ? "bg-orange/20 text-orange"
                          : "bg-red/20 text-red"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setModal({ purchaseId: p.id });
                          setPage("invoice");
                        }}
                        className="bg-surface2 border border-border rounded-md px-2 py-1.5 text-sm hover:border-accent transition-colors"
                        title="Invoice"
                      >
                        🧾
                      </button>
                      <button
                        onClick={() => {
                          setModal({ data: p });
                          setPage("add-purchase");
                        }}
                        className="bg-surface2 border border-border rounded-md px-2 py-1.5 text-sm hover:border-accent transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}