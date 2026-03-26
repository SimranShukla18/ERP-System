import { useState } from "react";
import { useApp } from "../context/AppContext";
import { fmt, uid, today } from "../utils/helpers";
import Field from "./common/Field";
import MiniField from "./common/MiniField";

const blankItem = () => ({
  id: uid(),
  type: "METAL",
  metalType: "Gold",
  purity: "22K",
  weight: "",
  rate: "",
  qty: 1,
  itemName: "",
  category: "Necklace",
  grossWeight: "",
  netWeight: "",
  makingCharges: "",
  amount: 0,
});

export default function PurchaseForm({ editData }) {
  const { suppliers, setPurchases, showToast, setPage, setModal } = useApp();
  const [form, setForm] = useState(
    editData || {
      supplierId: "",
      invoiceNo: "",
      date: today(),
      gstPct: 3,
      paid: 0,
      items: [blankItem()],
    }
  );
  const [errors, setErrors] = useState({});

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  const setItem = (id, key, val) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((it) =>
        it.id === id ? recalcItem({ ...it, [key]: val }) : it
      ),
    }));
  };

  const recalcItem = (it) => {
    if (it.type === "METAL") {
      it.amount = (parseFloat(it.weight) || 0) * (parseFloat(it.rate) || 0);
    } else {
      it.amount =
        (parseFloat(it.netWeight) || 0) * (parseFloat(it.rate) || 0) +
        (parseFloat(it.makingCharges) || 0) * (parseFloat(it.qty) || 1);
    }
    return it;
  };

  const addRow = () => {
    setForm((f) => ({ ...f, items: [...f.items, blankItem()] }));
  };

  const delRow = (id) => {
    setForm((f) => ({ ...f, items: f.items.filter((it) => it.id !== id) }));
  };

  const subtotal = form.items.reduce((a, it) => a + (it.amount || 0), 0);
  const gstAmt = subtotal * (parseFloat(form.gstPct) || 0) / 100;
  const total = subtotal + gstAmt;
  const balance = total - (parseFloat(form.paid) || 0);
  const status =
    form.paid <= 0 ? "UNPAID" : balance <= 0.01 ? "PAID" : "PARTIAL";

  const save = (print = false) => {
    const e = {};
    if (!form.supplierId) e.supplierId = "Select supplier";
    if (!form.invoiceNo.trim()) e.invoiceNo = "Invoice number required";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const rec = {
      ...form,
      id: editData?.id || Date.now(),
      supplierId: Number(form.supplierId),
      subtotal,
      gstAmt,
      total,
      balance,
      status,
    };

    if (editData) {
      setPurchases((p) => p.map((x) => (x.id === editData.id ? rec : x)));
    } else {
      setPurchases((p) => [...p, rec]);
    }

    showToast("Purchase saved successfully!");
    if (print) {
      setModal({ purchaseId: rec.id });
      setPage("invoice");
    } else {
      setPage("purchases");
    }
  };

  const selectedSupplier = suppliers.find((x) => x.id == form.supplierId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr_260px] gap-4 items-start">
      {/* Supplier Info Panel */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 pb-2 border-b border-border">
          🟣 Supplier Info
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
        <Field label="Invoice Number *" error={errors.invoiceNo}>
          <input
            className={`w-full px-3 py-2 rounded-lg bg-surface2 border ${
              errors.invoiceNo ? "border-red" : "border-border"
            } focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text`}
            value={form.invoiceNo}
            onChange={(e) => setField("invoiceNo", e.target.value)}
            placeholder="INV-001"
          />
        </Field>
        <Field label="Purchase Date">
          <input
            type="date"
            className="w-full px-3 py-2 rounded-lg bg-surface2 border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text"
            value={form.date}
            onChange={(e) => setField("date", e.target.value)}
          />
        </Field>
        {selectedSupplier && (
          <div className="mt-4 p-3 rounded-lg bg-surface2 border border-border">
            <div className="font-medium text-text">{selectedSupplier.name}</div>
            <div className="text-xs text-muted mt-1">
              {selectedSupplier.phone} · {selectedSupplier.gst || "No GST"}
            </div>
            <div className="text-xs text-muted">
              Credit Limit: {fmt(selectedSupplier.creditLimit)}
            </div>
          </div>
        )}
      </div>

      {/* Items Panel */}
      <div className="bg-surface border border-border rounded-xl p-5 flex flex-col">
        <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 pb-2 border-b border-border">
          🟡 Purchase Items
        </div>
        <div className="max-h-[480px] overflow-y-auto pr-2 space-y-3">
          {form.items.map((it, idx) => (
            <div
              key={it.id}
              className="bg-surface2 border border-border rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-muted font-semibold flex-1">
                  Item {idx + 1}
                </span>
                <select
                  className="text-sm bg-surface border border-border rounded-md px-2 py-1"
                  value={it.type}
                  onChange={(e) => setItem(it.id, "type", e.target.value)}
                >
                  <option value="METAL">Metal</option>
                  <option value="JEWELLERY">Jewellery</option>
                </select>
                {form.items.length > 1 && (
                  <button
                    onClick={() => delRow(it.id)}
                    className="text-red bg-red/10 border border-red/30 rounded-md px-2 py-0.5 text-xs hover:bg-red/20"
                  >
                    ✕
                  </button>
                )}
              </div>

              {it.type === "METAL" ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MiniField label="Metal Type">
                    <select
                      className="w-full px-2 py-1 rounded-md bg-surface border border-border text-text text-sm"
                      value={it.metalType}
                      onChange={(e) => setItem(it.id, "metalType", e.target.value)}
                    >
                      <option>Gold</option>
                      <option>Silver</option>
                      <option>Platinum</option>
                    </select>
                  </MiniField>
                  <MiniField label="Purity">
                    <select
                      className="w-full px-2 py-1 rounded-md bg-surface border border-border text-text text-sm"
                      value={it.purity}
                      onChange={(e) => setItem(it.id, "purity", e.target.value)}
                    >
                      <option>24K</option>
                      <option>22K</option>
                      <option>18K</option>
                      <option>Sterling</option>
                      <option>999</option>
                    </select>
                  </MiniField>
                  <MiniField label="Weight (g)">
                    <input
                      type="number"
                      className="w-full px-2 py-1 rounded-md bg-surface border border-border text-text text-sm"
                      value={it.weight}
                      onChange={(e) => setItem(it.id, "weight", e.target.value)}
                      placeholder="0"
                    />
                  </MiniField>
                  <MiniField label="Rate/g (₹)">
                    <input
                      type="number"
                      className="w-full px-2 py-1 rounded-md bg-surface border border-border text-text text-sm"
                      value={it.rate}
                      onChange={(e) => setItem(it.id, "rate", e.target.value)}
                      placeholder="0"
                    />
                  </MiniField>
                  <MiniField label="Amount">
                    <input
                      readOnly
                      className="w-full px-2 py-1 rounded-md bg-accent/5 border border-accent/20 text-accent font-semibold text-sm"
                      value={fmt(it.amount)}
                    />
                  </MiniField>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MiniField label="Product Name">
                    <input
                      className="w-full px-2 py-1 rounded-md bg-surface border border-border text-text text-sm"
                      value={it.itemName}
                      onChange={(e) => setItem(it.id, "itemName", e.target.value)}
                      placeholder="e.g. Necklace"
                    />
                  </MiniField>
                  <MiniField label="Category">
                    <select
                      className="w-full px-2 py-1 rounded-md bg-surface border border-border text-text text-sm"
                      value={it.category}
                      onChange={(e) => setItem(it.id, "category", e.target.value)}
                    >
                      <option>Necklace</option>
                      <option>Ring</option>
                      <option>Bracelet</option>
                      <option>Earring</option>
                      <option>Bangle</option>
                      <option>Pendant</option>
                    </select>
                  </MiniField>
                  <MiniField label="Gross Wt (g)">
                    <input
                      type="number"
                      className="w-full px-2 py-1 rounded-md bg-surface border border-border text-text text-sm"
                      value={it.grossWeight}
                      onChange={(e) => setItem(it.id, "grossWeight", e.target.value)}
                      placeholder="0"
                    />
                  </MiniField>
                  <MiniField label="Net Wt (g)">
                    <input
                      type="number"
                      className="w-full px-2 py-1 rounded-md bg-surface border border-border text-text text-sm"
                      value={it.netWeight}
                      onChange={(e) => setItem(it.id, "netWeight", e.target.value)}
                      placeholder="0"
                    />
                  </MiniField>
                  <MiniField label="Rate/g (₹)">
                    <input
                      type="number"
                      className="w-full px-2 py-1 rounded-md bg-surface border border-border text-text text-sm"
                      value={it.rate}
                      onChange={(e) => setItem(it.id, "rate", e.target.value)}
                      placeholder="0"
                    />
                  </MiniField>
                  <MiniField label="Qty">
                    <input
                      type="number"
                      className="w-full px-2 py-1 rounded-md bg-surface border border-border text-text text-sm"
                      value={it.qty}
                      onChange={(e) => setItem(it.id, "qty", e.target.value)}
                      min={1}
                    />
                  </MiniField>
                  <MiniField label="Making (₹)">
                    <input
                      type="number"
                      className="w-full px-2 py-1 rounded-md bg-surface border border-border text-text text-sm"
                      value={it.makingCharges}
                      onChange={(e) => setItem(it.id, "makingCharges", e.target.value)}
                      placeholder="0"
                    />
                  </MiniField>
                  <MiniField label="Amount">
                    <input
                      readOnly
                      className="w-full px-2 py-1 rounded-md bg-accent/5 border border-accent/20 text-accent font-semibold text-sm"
                      value={fmt(it.amount)}
                    />
                  </MiniField>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addRow}
          className="mt-4 w-full py-2 rounded-lg border border-dashed border-accent/30 text-accent text-sm hover:bg-accent/10 transition-colors"
        >
          ➕ Add Row
        </button>
      </div>

      {/* Summary Panel */}
      <div className="bg-surface border border-border rounded-xl p-5 flex flex-col">
        <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 pb-2 border-b border-border">
          🟢 Summary
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-muted text-sm border-b border-border pb-2">
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted text-sm border-b border-border pb-2">
            <span>GST</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-14 px-1 py-0.5 rounded-md bg-surface2 border border-border text-text text-sm text-center"
                value={form.gstPct}
                onChange={(e) => setField("gstPct", e.target.value)}
              />
              <span>%</span>
              <span>{fmt(gstAmt)}</span>
            </div>
          </div>
          <div className="flex justify-between text-accent font-bold text-lg border-b-2 border-accent py-2">
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>
          <div className="pt-2">
            <Field label="Paid Amount (₹)">
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg bg-surface2 border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text"
                value={form.paid}
                onChange={(e) => setField("paid", e.target.value)}
                placeholder="0"
              />
            </Field>
          </div>
          <div className="flex justify-between text-muted text-sm">
            <span>Balance</span>
            <span className={balance > 0 ? "text-red" : "text-green"}>
              {fmt(balance)}
            </span>
          </div>
          <div className="flex justify-between text-muted text-sm mt-2">
            <span>Payment Status</span>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                status === "PAID"
                  ? "bg-green/20 text-green"
                  : status === "PARTIAL"
                  ? "bg-orange/20 text-orange"
                  : "bg-red/20 text-red"
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-6 pt-4 border-t border-border">
          <button
            onClick={() => setPage("purchases")}
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface2 text-text hover:border-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => save(false)}
            className="flex-1 px-3 py-2 rounded-lg bg-accent text-black font-semibold hover:bg-amber-500 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => save(true)}
            className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-accent to-amber-700 text-black font-semibold hover:opacity-90 transition-colors"
          >
            Save & Print
          </button>
        </div>
      </div>
    </div>
  );
}