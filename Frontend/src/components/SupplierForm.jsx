import { useState } from "react";
import { useApp } from "../context/AppContext";
import { phoneRx, gstRx } from "../utils/helpers";
import Field from "./common/Field";

export default function SupplierForm({ editData }) {
  const { setSuppliers, showToast, setPage } = useApp();
  const [form, setForm] = useState(
    editData || {
      name: "",
      phone: "",
      email: "",
      address: "",
      gst: "",
      pan: "",
      openingBalance: "",
      creditLimit: "",
      status: "active",
    }
  );
  const [errors, setErrors] = useState({});

  const setValue = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Supplier name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!phoneRx.test(form.phone))
      e.phone = "Invalid phone (10 digits, starts with 6-9)";
    if (form.gst && !gstRx.test(form.gst.toUpperCase()))
      e.gst = "Invalid GST format";
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    if (editData) {
      setSuppliers((s) =>
        s.map((x) =>
          x.id === editData.id ? { ...form, id: editData.id } : x
        )
      );
      showToast("Supplier updated successfully!");
    } else {
      setSuppliers((s) => [
        ...s,
        {
          ...form,
          id: Date.now(),
          openingBalance: Number(form.openingBalance) || 0,
          creditLimit: Number(form.creditLimit) || 0,
        },
      ]);
      showToast("Supplier added successfully!");
    }
    setPage("suppliers");
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-7">
      <div className="font-playfair text-lg text-accent mb-6 pb-2 border-b border-border">
        {editData ? "Edit Supplier" : "New Supplier"}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Field label="Supplier Name *" error={errors.name}>
            <input
              className={`w-full px-3 py-2 rounded-lg bg-surface2 border ${
                errors.name ? "border-red" : "border-border"
              } focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text`}
              value={form.name}
              onChange={(e) => setValue("name", e.target.value)}
              placeholder="e.g. Mehta Gold Traders"
            />
          </Field>
          <Field label="Phone *" error={errors.phone}>
            <input
              className={`w-full px-3 py-2 rounded-lg bg-surface2 border ${
                errors.phone ? "border-red" : "border-border"
              } focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text`}
              value={form.phone}
              onChange={(e) => setValue("phone", e.target.value)}
              placeholder="10-digit mobile number"
              maxLength={10}
            />
          </Field>
          <Field label="Email">
            <input
              className="w-full px-3 py-2 rounded-lg bg-surface2 border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text"
              value={form.email}
              onChange={(e) => setValue("email", e.target.value)}
              placeholder="email@example.com"
              type="email"
            />
          </Field>
          <Field label="Address">
            <textarea
              className="w-full px-3 py-2 rounded-lg bg-surface2 border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text"
              value={form.address}
              onChange={(e) => setValue("address", e.target.value)}
              placeholder="Full address"
              rows={3}
            />
          </Field>
        </div>

        <div className="space-y-4">
          <Field label="GST Number" error={errors.gst}>
            <input
              className={`w-full px-3 py-2 rounded-lg bg-surface2 border ${
                errors.gst ? "border-red" : "border-border"
              } focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text`}
              value={form.gst}
              onChange={(e) => setValue("gst", e.target.value.toUpperCase())}
              placeholder="27AABCM1234D1Z5"
              maxLength={15}
            />
          </Field>
          <Field label="PAN Number">
            <input
              className="w-full px-3 py-2 rounded-lg bg-surface2 border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text"
              value={form.pan}
              onChange={(e) => setValue("pan", e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength={10}
            />
          </Field>
          <Field label="Opening Balance (₹)">
            <input
              className="w-full px-3 py-2 rounded-lg bg-surface2 border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text"
              type="number"
              value={form.openingBalance}
              onChange={(e) => setValue("openingBalance", e.target.value)}
              placeholder="0.00"
            />
          </Field>
          <Field label="Credit Limit (₹)">
            <input
              className="w-full px-3 py-2 rounded-lg bg-surface2 border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text"
              type="number"
              value={form.creditLimit}
              onChange={(e) => setValue("creditLimit", e.target.value)}
              placeholder="500000"
            />
          </Field>
          <Field label="Status">
            <select
              className="w-full px-3 py-2 rounded-lg bg-surface2 border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-text"
              value={form.status}
              onChange={(e) => setValue("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-border">
        <button
          onClick={() => setPage("suppliers")}
          className="px-4 py-2 rounded-lg border border-border bg-surface2 text-text hover:border-accent transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={save}
          className="px-4 py-2 rounded-lg bg-accent text-black font-semibold hover:bg-amber-500 transition-colors"
        >
          {editData ? "Update Supplier" : "Save Supplier"}
        </button>
      </div>
    </div>
  );
}