import { useApp } from "../context/AppContext";
import { fmt } from "../utils/helpers";

export default function PurchaseInvoice({ purchaseId }) {
  const { purchases, suppliers, setPage } = useApp();
  const p = purchases.find((x) => x.id === purchaseId) || purchases[purchases.length - 1];
  if (!p)
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center text-muted">
        No invoice found.
      </div>
    );

  const s = suppliers.find((x) => x.id === p.supplierId);

  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <button
          onClick={() => setPage("purchases")}
          className="px-4 py-2 rounded-lg border border-border bg-surface2 text-text hover:border-accent transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-lg bg-accent text-black font-semibold hover:bg-amber-500 transition-colors"
        >
          🖨 Print
        </button>
      </div>

      <div
        id="invoice-print"
        className="bg-surface border border-border rounded-xl p-8 max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-start pb-6 border-b-2 border-accent mb-6">
          <div>
            <div className="font-playfair text-2xl text-accent">◆ GoldERP Jewellers</div>
            <div className="text-xs text-muted mt-1">
              GSTIN: 27AABCG1234H1Z5 · Mumbai, Maharashtra
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted uppercase tracking-wider">PURCHASE INVOICE</div>
            <div className="text-xl font-bold text-text">{p.invoiceNo}</div>
            <div className="text-xs text-muted mt-1">{p.date}</div>
          </div>
        </div>

        {/* Supplier Info */}
        <div className="bg-surface2 border border-border rounded-lg p-4 mb-6">
          <div className="text-xs text-muted uppercase">BILL FROM</div>
          <div className="text-base font-semibold text-text mt-1">{s?.name}</div>
          <div className="text-xs text-muted mt-1">{s?.address}</div>
          <div className="text-xs text-muted">
            GST: {s?.gst || "N/A"} · PAN: {s?.pan || "N/A"}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse">
          <thead className="bg-surface2 text-muted text-xs font-medium uppercase">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Weight/Qty</th>
              <th className="px-4 py-3 text-left">Rate</th>
              <th className="px-4 py-3 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {p.items.map((it, i) => (
              <tr key={i} className="border-b border-border">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3">
                  {it.type === "METAL"
                    ? `${it.metalType} (${it.purity})`
                    : `${it.itemName} - ${it.category}`}
                </td>
                <td className="px-4 py-3">
                  {it.type === "METAL"
                    ? `${it.weight}g`
                    : `${it.netWeight}g × ${it.qty}`}
                </td>
                <td className="px-4 py-3">
                  {fmt(it.rate)}/g
                  {it.makingCharges ? ` + ${fmt(it.makingCharges)} making` : ""}
                </td>
                <td className="px-4 py-3">{fmt(it.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="ml-auto w-80 mt-6 border border-border rounded-lg overflow-hidden">
          <div className="flex justify-between px-4 py-2 border-b border-border text-muted text-sm">
            <span>Subtotal</span>
            <span>{fmt(p.subtotal)}</span>
          </div>
          <div className="flex justify-between px-4 py-2 border-b border-border text-muted text-sm">
            <span>GST ({p.gstPct}%)</span>
            <span>{fmt(p.gstAmt)}</span>
          </div>
          <div className="flex justify-between px-4 py-2 border-b border-border bg-accent/10 text-accent font-bold">
            <span>Total</span>
            <span>{fmt(p.total)}</span>
          </div>
          <div className="flex justify-between px-4 py-2 border-b border-border text-muted text-sm">
            <span>Amount Paid</span>
            <span className="text-green">{fmt(p.paid)}</span>
          </div>
          <div className="flex justify-between px-4 py-2 text-muted text-sm">
            <span>Balance Due</span>
            <span className={p.balance > 0 ? "text-red" : "text-green"}>
              {fmt(p.balance)}
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <span
            className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase ${
              p.status === "PAID"
                ? "bg-green/20 text-green"
                : p.status === "PARTIAL"
                ? "bg-orange/20 text-orange"
                : "bg-red/20 text-red"
            }`}
          >
            {p.status}
          </span>
        </div>

        <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted">
          Thank you for your business. This is a computer-generated invoice.
        </div>
      </div>
    </div>
  );
}