import { createContext, useState } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [order, setOrder] = useState({
    order_type_id: 1,
    user_id: user.id,
    discount: 0,
  });

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
