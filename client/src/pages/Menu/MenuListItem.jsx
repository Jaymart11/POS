/* eslint-disable react/prop-types */
import { Card, Col, Typography, Badge, Flex } from "antd";
import { OrderItemContext } from "../../stores/orderItemContext";
import { useContext } from "react";

const { Text, Title } = Typography;

const MenuListItem = ({ item }) => {
  const { orderItem, addItemToOrder, totalPackagingItem } =
    useContext(OrderItemContext);

  const handleAdd = () => {
    addItemToOrder({
      product_id: item.id,
      name: item.product_name,
      packaging_details: item.packaging_details,
      price_at_order: item.price,
    });
  };

  const currentQuantity =
    orderItem?.filter((or) => or.product_id === item.id)?.[0]?.quantity || 0;

  const total_packaging = item.packaging_details.map((pd) => ({
    ...pd,
    quantity: totalPackagingItem()[pd.packaging_id]
      ? pd.quantity - totalPackagingItem()[pd.packaging_id]
      : pd.quantity,
  }));

  const qtyStatus = () => {
    const remainingQuantity = item.product_quantity - currentQuantity;

    if (
      remainingQuantity === 0 ||
      total_packaging.some((tp) => tp.quantity === 0)
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
    const remainingProduct = item.product_quantity - currentQuantity;
    if (remainingProduct > item.stock_notification) {
      return "white";
    } else if (
      remainingProduct >= 1 &&
      remainingProduct <= item.stock_notification
    ) {
      return "rgb(245, 199, 17)";
    } else {
      return "rgb(194,64,52)";
    }
  };

  const packagingStatus = () => {
    if (
      total_packaging.some(
        (tp) => tp.quantity > tp.packaging_stock_notification
      )
    ) {
      return "white";
    } else if (
      total_packaging.some((tp) => tp.quantity >= 1) &&
      total_packaging.some(
        (tp) => tp.quantity <= tp.packaging_stock_notification
      )
    ) {
      return "rgb(245, 199, 17)";
    } else {
      return "rgb(194,64,52)";
    }
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
            item.product_quantity - currentQuantity > 0 &&
            !total_packaging.some((tp) => tp.quantity === 0)
              ? handleAdd
              : null
          }
        >
          <Title level={3} style={{ margin: 0 }}>
            {item.product_name}{" "}
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
                Qty: {item.product_quantity - currentQuantity}
              </Text>
              <Text style={{ margin: 0 }}>
                <br />
                <b>Pkg Qty</b>
              </Text>

              <Text style={{ margin: 0, color: packagingStatus() }}>
                {total_packaging.map((tp, index) => {
                  return (
                    <span key={index}>
                      {tp.packaging_name} : {tp.quantity}
                      <br />
                    </span>
                  );
                })}
              </Text>
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
