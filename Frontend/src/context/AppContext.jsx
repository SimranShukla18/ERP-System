import { createContext, useContext, useState } from "react";
import { INITIAL_SUPPLIERS, INITIAL_PURCHASES, INITIAL_PAYMENTS } from "../data/sampleData";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

export const AppProvider = ({ children, value }) => {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [purchases, setPurchases] = useState(INITIAL_PURCHASES);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);

  const { page, setPage, modal, setModal, showToast } = value;

  return (
    <AppContext.Provider
      value={{
        suppliers,
        setSuppliers,
        purchases,
        setPurchases,
        payments,
        setPayments,
        page,
        setPage,
        modal,
        setModal,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};