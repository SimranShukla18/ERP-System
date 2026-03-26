export const fmt = (n) =>
  "₹" +
  Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

export const today = () => new Date().toISOString().split("T")[0];

export const uid = () => Date.now() + Math.random();

export const gstRx = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const phoneRx = /^[6-9]\d{9}$/;

export const getSupplierBalance = (suppId, purchases, payments, suppliers) => {
  const s = suppliers.find((x) => x.id === suppId);
  const totalPurchase = purchases
    .filter((p) => p.supplierId === suppId)
    .reduce((a, p) => a + p.total, 0);
  const totalPaid = payments
    .filter((p) => p.supplierId === suppId)
    .reduce((a, p) => a + p.amount, 0);
  return (s?.openingBalance || 0) + totalPurchase - totalPaid;
};