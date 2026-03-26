import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { fmt, getSupplierBalance } from "../utils/helpers";
import Field from "./common/Field";
import StatCard from "./common/StatCard";

export default function SupplierLedger({ supplierId: initSuppId }) {
  const { suppliers, purchases, payments } = useApp();
  const [supplierId, setSupplierId] = useState(initSuppId || suppliers[0]?.id);

  const s = suppliers.find((x) => x.id === supplierId);

  const entries = useMemo(() => {
    if (!supplierId) return [];
    const rows = [];
    purchases
      .filter((p) => p.supplierId === supplierId)
      .forEach((p) =>
        rows.push({
          date: p.date,
          type: "Purchase",
          ref: p.invoiceNo,
          debit: 0,
          credit: p.total,
          raw: p.total,
        })
      );
    payments
      .filter((p) => p.supplierId === supplierId)
      .forEach((p) =>
        rows.push({
          date: p.date,
          type: "Payment",
          ref: p.reference || p.mode,
          debit: p.amount,
          credit: 0,
          raw: -p.amount,
        })
      );
    rows.sort((a, b) => a.date.localeCompare(b.date));
    let bal = s?.openingBalance || 0;
    return rows.map((r) => {
      bal += r.raw;
      return { ...r, balance: bal };
    });
  }, [supplierId, purchases, payments, s]);

  const totalPurchase = purchases
    .filter((p) => p.supplierId === supplierId)
    .reduce((a, p) => a + p.total, 0);
  const totalPaid = payments
    .filter((p) => p.supplierId === supplierId)
    .reduce((a, p) => a + p.amount, 0);
  const balance = (s?.openingBalance || 0) + totalPurchase - totalPaid;

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Field label="Select Supplier" inline>
          <select
            className="px-3 py-2 rounded-lg bg-surface2 border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text min-w-[220px]"
            value={supplierId}
            onChange={(e) => setSupplierId(Number(e.target.value))}
          >
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {s && (
        <>
          <div className="bg-gradient-to-r from-accent/10 to-accent2/10 border border-accent/20 rounded-xl p-5">
            <div className="font-playfair text-xl text-accent mb-1">{s.name}</div>
            <div className="text-sm text-muted">
              {s.phone} · {s.gst || "No GST"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon="📦"
              label="Total Purchase"
              value={fmt(totalPurchase)}
              color="accent2"
            />
            <StatCard
              icon="💰"
              label="Total Paid"
              value={fmt(totalPaid)}
              color="green"
            />
            <StatCard
              icon="⚖️"
              label="Balance Due"
              value={fmt(balance)}
              color={balance > 0 ? "red" : "green"}
            />
          </div>

          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface2 text-muted text-xs font-medium uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Reference</th>
                  <th className="px-4 py-3 text-left">Debit (Payment)</th>
                  <th className="px-4 py-3 text-left">Credit (Purchase)</th>
                  <th className="px-4 py-3 text-left">Balance</th>
                </tr>
              </thead>
              <tbody>
                {s.openingBalance > 0 && (
                  <tr className="border-b border-border hover:bg-white/5">
                    <td className="px-4 py-3 font-mono">—</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-md text-xs bg-orange/15 text-orange">
                        Opening
                      </span>
                    </td>
                    <td className="px-4 py-3">Opening Balance</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3 text-accent2">
                      {fmt(s.openingBalance)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-orange">
                      {fmt(s.openingBalance)}
                    </td>
                  </tr>
                )}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted">
                      No transactions yet
                    </td>
                  </tr>
                )}
                {entries.map((e, i) => (
                  <tr
                    key={i}
                    className="border-b border-border hover:bg-white/5 last:border-none"
                  >
                    <td className="px-4 py-3 font-mono text-sm">{e.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-xs ${
                          e.type === "Purchase"
                            ? "bg-accent2/15 text-accent2"
                            : "bg-green/15 text-green"
                        }`}
                      >
                        {e.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-accent">
                      {e.ref}
                    </td>
                    <td className="px-4 py-3 text-green">
                      {e.debit > 0 ? fmt(e.debit) : "—"}
                    </td>
                    <td className="px-4 py-3 text-accent2">
                      {e.credit > 0 ? fmt(e.credit) : "—"}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        e.balance > 0 ? "text-red" : "text-green"
                      }`}
                    >
                      {fmt(e.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}