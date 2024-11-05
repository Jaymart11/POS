/* eslint-disable react/prop-types */
import { Card, Col, Typography, Badge, Flex } from "antd";
import { OrderItemContext } from "../../stores/orderItemContext";
import { useContext } from "react";
import useNotification from "../../hooks/useNotification";

const { Text, Title } = Typography;

const MenuListItem = ({ item, prod }) => {
  const openNotificationWithIcon = useNotification();
  const { orderItem, addItemToOrder, totalPackagingItem, totalProductItem } =
    useContext(OrderItemContext);

  const currentQuantity =
    orderItem?.filter((or) => or.product_id === item.id)?.[0]?.quantity || 0;

  // const remainingQuantity = item.product_quantity - currentQuantity;

  const total_packaging = item.packaging_details.map((pd) => ({
    ...pd,
    quantity: totalPackagingItem()[pd.packaging_id]
      ? pd.quantity - totalPackagingItem()[pd.packaging_id]
      : pd.quantity,
  }));

  const remainingQuantity = totalProductItem()[item.id]
    ? item.product_quantity - totalProductItem()[item.id]
    : item.product_quantity;

  const handleAdd = () => {
    if (remainingQuantity > 0) {
      // Add main product if in stock
      addItemToOrder({
        product_id: item.id,
        name: item.product_name,
        packaging_details: item.packaging_details,
        price_at_order: item.price,
        conversions: [],
      });
    } else {
      // Main product is out of stock, use conversions
      let requiredQuantity = 1; // Quantity we want to fulfill
      const conversions = [];

      for (const conversion of item.product_conversion) {
        const {
          conversion_product_id,
          conversion_ratio,
          conversion_product_name,
        } = conversion;

        const conversionStock =
          prod.filter(({ id }) => id == conversion_product_id)[0]
            ?.product_quantity -
            (totalProductItem()[conversion_product_id] || 0) || 0;
        const conversionNeeded =
          requiredQuantity * parseFloat(conversion_ratio);

        if (conversionStock > 0) {
          if (conversionStock >= conversionNeeded) {
            conversions.push({
              product_id: conversion_product_id,
              quantity: conversionNeeded,
              conversion_ratio,
              conversion_product_name,
            });
            requiredQuantity = 0; // Order fulfilled
            break;
          } else {
            // Partial stock, add available amount and adjust requiredQuantity
            const partialQuantity =
              conversionStock / parseFloat(conversion_ratio);
            conversions.push({
              product_id: conversion_product_id,
              quantity: conversionStock,
              conversion_ratio,
              conversion_product_name,
            });
            requiredQuantity -= partialQuantity; // Decrease remaining requirement
          }
        }
      }

      // Check if we managed to fulfill the entire requiredQuantity
      if (requiredQuantity > 0) {
        openNotificationWithIcon(
          "error",
          "Insufficient stock for product and conversions."
        );
        return;
      }

      // Add the main product with conversion items
      addItemToOrder({
        product_id: item.id,
        name: item.product_name,
        packaging_details: item.packaging_details,
        price_at_order: item.price,
        conversions: conversions,
      });
    }
  };

  const qtyStatus = () => {
    if (
      remainingQuantity <= 0 ||
      total_packaging.some((tp) => tp.quantity <= 0)
    ) {
      return "rgb(194, 64, 52)";
    } else if (
      (remainingQuantity >= 1 &&
        remainingQuantity <= item.stock_notification) ||
      (total_packaging.some((tp) => tp.quantity >= 1) &&
        total_packaging.some((tp) => tp.quantity <= item.stock_notification))
    ) {
      return "rgb(245, 199, 17)";
    } else {
      return "rgb(40, 128, 99)";
    }
  };

  const productStatus = () => {
    if (remainingQuantity > item.stock_notification) {
      return "white";
    } else if (
      remainingQuantity >= 1 &&
      remainingQuantity <= item.stock_notification
    ) {
      return "rgb(245, 199, 17)";
    } else {
      return "rgb(194,64,52)";
    }
  };

  const packagingStatus = (quantity, packaging_stock_notification) => {
    if (quantity <= 0) {
      return "rgb(194,64,52)";
    } else if (quantity > packaging_stock_notification) {
      return "white";
    } else if (quantity >= 1 && quantity <= packaging_stock_notification) {
      return "rgb(245, 199, 17)";
    }
  };

  const notif = () => {
    openNotificationWithIcon("error", "Insufficient stock for packaging.");
  };

  return (
    <>
      <Col xs={24} md={12} xl={8} style={{ display: "flex" }}>
        <Card
          bordered={true}
          hoverable={true}
          style={{
            minWidth: "200px",
            borderLeft: `5px solid ${qtyStatus()}`,
            width: "100%",
          }}
          onClick={
            total_packaging.some((tp) => tp.quantity === 0) ? notif : handleAdd
          }
        >
          <Title level={3} style={{ margin: 0 }}>
            {item.product_name}
          </Title>

          <Title
            type="success"
            level={5}
            style={{ margin: " 0 0 0 0", color: "rgb(40,128,99)" }}
          >
            PHP {item.price}{" "}
          </Title>
          <Flex justify="space-between" align="center">
            <Flex vertical>
              <Text style={{ margin: 0, color: productStatus() }}>
                Qty: {remainingQuantity > 0 ? remainingQuantity : 0}
              </Text>
              <Text style={{ margin: 0 }}>
                <br />
                <b>Pkg Qty</b>
              </Text>

              {total_packaging.map((tp, index) => {
                return (
                  <Text
                    style={{
                      margin: 0,
                      color: packagingStatus(
                        tp.quantity,
                        tp.packaging_stock_notification
                      ),
                    }}
                    key={index}
                  >
                    {tp.packaging_name} : {tp.quantity}
                    <br />
                  </Text>
                );
              })}
            </Flex>
            <Badge
              dot={false}
              showZero={false}
              count={currentQuantity}
              color="rgb(245, 199, 17)"
              style={{
                position: "absolute",
                top: -135,
                right: -30,
                fontWeight: "bold",
                display: currentQuantity > 0 ? "" : "none",
              }}
            />
          </Flex>
        </Card>
      </Col>
    </>
  );
};

export default MenuListItem;
