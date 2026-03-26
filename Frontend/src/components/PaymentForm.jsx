import { useState } from "react";
import { useApp } from "../context/AppContext";
import { fmt, getSupplierBalance, today } from "../utils/helpers";
import Field from "./common/Field";

export default function PaymentForm() {
  const { suppliers, purchases, payments, setPayments, showToast } = useApp();
  const [form, setForm] = useState({
    supplierId: "",
    amount: "",
    mode: "Cash",
    reference: "",
    date: today(),
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  const supplierBalance = form.supplierId
    ? getSupplierBalance(Number(form.supplierId), purchases, payments, suppliers)
    : 0;

  const save = () => {
    const e = {};
    if (!form.supplierId) e.supplierId = "Select supplier";
    if (!form.amount || parseFloat(form.amount) <= 0)
      e.amount = "Enter valid amount";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const rec = {
      ...form,
      id: Date.now(),
      supplierId: Number(form.supplierId),
      amount: parseFloat(form.amount),
    };
    setPayments((p) => [...p, rec]);
    showToast("Payment recorded!");
    setForm({
      supplierId: "",
      amount: "",
      mode: "Cash",
      reference: "",
      date: today(),
      notes: "",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5">
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="font-playfair text-lg text-accent mb-6 pb-2 border-b border-border">
          Record New Payment
        </div>
        <Field label="Supplier *" error={errors.supplierId}>
          <select
            className={`w-full px-3 py-2 rounded-lg bg-surface2 border ${
              errors.supplierId ? "border-red" : "border-border"
            } focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text`}
            value={form.supplierId}
            onChange={(e) => setField("supplierId", e.target.value)}
          >
            <option value="">— Select Supplier —</option>
            {suppliers
              .filter((s) => s.status === "active")
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
        </Field>
        {form.supplierId && (
          <div className="mb-4 p-2 rounded-lg bg-accent/10 border border-accent/20 text-sm text-muted">
            Outstanding:{" "}
            <span className={supplierBalance > 0 ? "text-red" : "text-green"}>
              {fmt(supplierBalance)}
            </span>
          </div>
        )}
        <Field label="Amount (₹) *" error={errors.amount}>
          <input
            type="number"
            className={`w-full px-3 py-2 rounded-lg bg-surface2 border ${
              errors.amount ? "border-red" : "border-border"
            } focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text`}
            value={form.amount}
            onChange={(e) => setField("amount", e.target.value)}
            placeholder="0.00"
          />
        </Field>
        <Field label="Payment Mode">
          <div className="grid grid-cols-4 gap-2">
            {["Cash", "Bank", "UPI", "Cheque"].map((m) => (
              <button
                key={m}
                onClick={() => setField("mode", m)}
                className={`px-2 py-1.5 rounded-md border ${
                  form.mode === m
                    ? "border-accent bg-accent/20 text-accent"
                    : "border-border bg-surface2 text-muted"
                } text-sm transition-colors`}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Reference Number">
          <input
            className="w-full px-3 py-2 rounded-lg bg-surface2 border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text"
            value={form.reference}
            onChange={(e) => setField("reference", e.target.value)}
            placeholder="UTR / Cheque No."
          />
        </Field>
        <Field label="Date">
          <input
            type="date"
            className="w-full px-3 py-2 rounded-lg bg-surface2 border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text"
            value={form.date}
            onChange={(e) => setField("date", e.target.value)}
          />
        </Field>
        <Field label="Notes">
          <textarea
            className="w-full px-3 py-2 rounded-lg bg-surface2 border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text"
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
            placeholder="Optional remarks"
            rows={2}
          />
        </Field>
        <button
          onClick={save}
          className="w-full mt-4 px-4 py-2 rounded-lg bg-accent text-black font-semibold hover:bg-amber-500 transition-colors"
        >
          💾 Save Payment
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="font-playfair text-lg text-accent p-6 pb-0">Recent Payments</div>
        <table className="w-full">
          <thead className="bg-surface2 text-muted text-xs font-medium uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Supplier</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Mode</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {[...payments].reverse().slice(0, 10).map((p) => {
              const s = suppliers.find((x) => x.id === p.supplierId);
              return (
                <tr
                  key={p.id}
                  className="border-b border-border hover:bg-white/5 last:border-none"
                >
                  <td className="px-4 py-3">{s?.name}</td>
                  <td className="px-4 py-3 text-green">{fmt(p.amount)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-md text-xs bg-blue/15 text-blue">
                      {p.mode}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm">{p.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}