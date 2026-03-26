import { useState, useEffect } from "react";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SupplierList from "./components/SupplierList";
import SupplierForm from "./components/SupplierForm";
import PurchaseList from "./components/PurchaseList";
import PurchaseForm from "./components/PurchaseForm";
import PaymentForm from "./components/PaymentForm";
import SupplierLedger from "./components/SupplierLedger";
import PurchaseInvoice from "./components/PurchaseInvoice";
import Toast from "./components/common/Toast";

export default function App() {
  const [page, setPage] = useState("suppliers");
  const [modal, setModal] = useState(null); // { type, data }
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const ctxValue = {
    page,
    setPage,
    modal,
    setModal,
    showToast,
  };

  const renderPage = () => {
    switch (page) {
      case "suppliers":
        return <SupplierList />;
      case "add-supplier":
        return <SupplierForm editData={modal?.data} />;
      case "purchases":
        return <PurchaseList />;
      case "add-purchase":
        return <PurchaseForm editData={modal?.data} />;
      case "payments":
        return <PaymentForm />;
      case "ledger":
        return <SupplierLedger supplierId={modal?.supplierId} />;
      case "invoice":
        return <PurchaseInvoice purchaseId={modal?.purchaseId} />;
      default:
        return <SupplierList />;
    }
  };

  return (
    <AppProvider value={ctxValue}>
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap"
          rel="stylesheet"
        />
        <Sidebar />
        <div className="ml-64 min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 p-8">{renderPage()}</div>
        </div>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </div>
    </AppProvider>
  );
}