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
        let updatedOrder = [...prevOrder];

        updatedOrder[itemIndex].quantity += 1;

        // Merge conversions if present
        if (newItem.conversions && newItem.conversions.length > 0) {
          newItem.conversions.forEach((newConversion) => {
            const existingConversionIndex = updatedOrder[
              itemIndex
            ].conversions.findIndex(
              (conversion) => conversion.product_id === newConversion.product_id
            );

            if (existingConversionIndex !== -1) {
              // Conversion exists, update its quantity
              updatedOrder[itemIndex].conversions[
                existingConversionIndex
              ].quantity += newConversion.quantity;
            } else {
              // Conversion does not exist, add as a new entry
              updatedOrder[itemIndex].conversions.push(newConversion);
            }
          });
        }
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

        // Decrease the main product quantity or remove it if it's the last one
        if (updatedOrder[itemIndex].quantity > 1) {
          updatedOrder[itemIndex].quantity -= 1;
        } else {
          updatedOrder.splice(itemIndex, 1);
          return updatedOrder;
        }

        // Handle conversions if they exist for this product
        if (
          updatedOrder[itemIndex] &&
          updatedOrder[itemIndex].conversions.length > 0
        ) {
          const conversions = [...updatedOrder[itemIndex].conversions];
          const lastConversionIndex = conversions.length - 1;
          const lastConversion = conversions[lastConversionIndex];

          // Calculate the decrease amount based on the conversion ratio
          const decreaseAmount = parseFloat(lastConversion.conversion_ratio);

          // Check if we can decrease the last conversion's quantity
          if (lastConversion.quantity > 0) {
            // If last conversion can be decreased without going below zero
            if (lastConversion.quantity >= decreaseAmount) {
              const newQuantity = lastConversion.quantity - decreaseAmount;

              // Update the quantity of the last conversion
              conversions[lastConversionIndex] = {
                ...lastConversion,
                quantity: newQuantity,
              };
            } else {
              // If not enough quantity in the last conversion, take the remaining amount
              const remainingToDecrease =
                decreaseAmount - lastConversion.quantity;
              conversions[lastConversionIndex].quantity = 0; // Set last conversion to zero

              // Check if there is a next conversion to decrement
              if (conversions.length > 1) {
                const nextConversionIndex = lastConversionIndex - 1;
                const nextConversion = conversions[nextConversionIndex];

                // Calculate how much to decrease from the next conversion
                const decreaseNextAmount = remainingToDecrease / 2; // Half of the last conversion's ratio

                // Ensure we only decrement if the next conversion has enough quantity
                if (nextConversion.quantity >= decreaseNextAmount) {
                  conversions[nextConversionIndex].quantity -=
                    decreaseNextAmount;
                } else {
                  console.warn(
                    "Not enough quantity in the next conversion to fulfill the requirement."
                  );
                }
              }
            }

            // Update the item's conversions
            updatedOrder[itemIndex].conversions = conversions;

            // Remove the last conversion if its quantity reaches zero
            if (conversions[lastConversionIndex].quantity === 0) {
              conversions.pop();
            }
          } else {
            console.warn(
              "Cannot decrease conversion quantity as it would go below zero."
            );
          }
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

  const totalPackagingItem = () => {
    const quantityByPackagingId = {};

    orderItem.forEach((product) => {
      product.packaging_details.map((pd) => {
        const packagingId = pd.packaging_id;
        const quantity = product.quantity;

        if (quantityByPackagingId[packagingId]) {
          quantityByPackagingId[packagingId] += quantity;
        } else {
          quantityByPackagingId[packagingId] = quantity;
        }
      });
    });
    return quantityByPackagingId;
  };

  const totalProductItem = () => {
    const quantityByProductId = {};

    orderItem.forEach((product) => {
      // if (product.conversions) {
      product.conversions.map((pd) => {
        const productId = pd.product_id;
        const quantity = pd.quantity;

        if (quantityByProductId[productId]) {
          quantityByProductId[productId] += quantity;
        } else {
          quantityByProductId[productId] = quantity;
        }
      });
      // } else {
      const productId1 = product.product_id;
      const quantity1 = product.quantity;

      if (quantityByProductId[productId1]) {
        quantityByProductId[productId1] += quantity1;
      } else {
        quantityByProductId[productId1] = quantity1;
      }
      // }
    });
    return quantityByProductId;
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
        totalPackagingItem,
        totalProductItem,
      }}
    >
      {children}
    </OrderItemContext.Provider>
  );
};
