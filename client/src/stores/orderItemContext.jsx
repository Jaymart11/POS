import { createContext, useState } from "react";

export const OrderItemContext = createContext();

export const OrderItemProvider = ({ children }) => {
  const [orderItem, setItemOrder] = useState([]);

  const addItemToOrder = (newItem) => {
    setItemOrder((prevOrder) => {
      const itemIndex = prevOrder.findIndex(
        (item) => item.product_id === newItem.product_id
      );
      if (itemIndex !== -1) {
        const updatedOrder = [...prevOrder];
        updatedOrder[itemIndex].quantity += 1;
        return updatedOrder;
      } else {
        return [...prevOrder, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeItemFromOrder = (itemId) => {
    setItemOrder((prevOrder) => {
      const itemIndex = prevOrder.findIndex(
        (item) => item.product_id === itemId
      );
      if (itemIndex !== -1) {
        const updatedOrder = [...prevOrder];
        if (updatedOrder[itemIndex].quantity > 1) {
          updatedOrder[itemIndex].quantity -= 1;
        } else {
          updatedOrder.splice(itemIndex, 1);
        }
        return updatedOrder;
      }
      return prevOrder;
    });
  };

  const totalPayment = () => {
    return orderItem.reduce(
      (total, item) => total + item.quantity * item.price_at_order,
      0
    );
  };

  const totalItems = () => {
    return orderItem.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <OrderItemContext.Provider
      value={{
        orderItem,
        addItemToOrder,
        removeItemFromOrder,
        totalPayment,
        totalItems,
        setItemOrder,
      }}
    >
      {children}
    </OrderItemContext.Provider>
  );
};
