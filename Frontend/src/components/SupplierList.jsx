import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { fmt, getSupplierBalance } from "../utils/helpers";
import StatCard from "./common/StatCard";

export default function SupplierList() {
  const { suppliers, purchases, payments, setModal, setPage } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const list = useMemo(() => {
    return suppliers.filter((s) => {
      const q = search.toLowerCase();
      const match =
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.gst.toLowerCase().includes(q);
      const statusMatch = filter === "all" || s.status === filter;
      return match && statusMatch;
    });
  }, [suppliers, search, filter]);

  const totalPayable = suppliers.reduce(
    (a, s) => a + getSupplierBalance(s.id, purchases, payments, suppliers),
    0
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => {
            setModal(null);
            setPage("add-supplier");
          }}
          className="bg-accent hover:bg-amber-500 text-black font-semibold px-4 py-2 rounded-lg transition-all"
        >
          ➕ Add Supplier
        </button>
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2 min-w-[260px]">
          <span>🔍</span>
          <input
            placeholder="Search name, phone, GST…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none flex-1 focus:outline-none text-text"
          />
        </div>
        <div className="flex gap-1 bg-surface border border-border rounded-lg p-1">
          {["all", "active", "inactive"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                filter === f
                  ? "bg-accent text-black font-semibold"
                  : "text-muted hover:text-text"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon="👥" label="Total Suppliers" value={suppliers.length} />
        <StatCard
          icon="✅"
          label="Active"
          value={suppliers.filter((s) => s.status === "active").length}
          color="green"
        />
        <StatCard
          icon="💳"
          label="Total Payable"
          value={fmt(totalPayable)}
          color="orange"
        />
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface2 text-muted text-xs font-medium uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Supplier Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">GST Number</th>
              <th className="px-4 py-3 text-left">Balance</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted">
                  No suppliers found
                </td>
              </tr>
            )}
            {list.map((s, i) => {
              const bal = getSupplierBalance(
                s.id,
                purchases,
                payments,
                suppliers
              );
              return (
                <tr
                  key={s.id}
                  className="border-b border-border hover:bg-white/5 last:border-none"
                >
                  <td className="px-4 py-3 text-muted">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-text">{s.name}</div>
                    <div className="text-xs text-muted">{s.email}</div>
                  </td>
                  <td className="px-4 py-3">{s.phone}</td>
                  <td className="px-4 py-3 font-mono text-sm">{s.gst || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold text-sm ${
                        bal > 0 ? "text-red" : "text-green"
                      }`}
                    >
                      {fmt(bal)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        s.status === "active"
                          ? "bg-green/15 text-green"
                          : "bg-red/15 text-red"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setModal({ data: s });
                          setPage("add-supplier");
                        }}
                        className="bg-surface2 border border-border rounded-md px-2 py-1.5 text-sm hover:border-accent transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          setModal({ supplierId: s.id });
                          setPage("ledger");
                        }}
                        className="bg-surface2 border border-border rounded-md px-2 py-1.5 text-sm hover:border-accent transition-colors"
                        title="Ledger"
                      >
                        🧾
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