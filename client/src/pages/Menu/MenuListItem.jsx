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
      packaging_id: item.packaging_id,
      price_at_order: item.price,
    });
  };

  const currentQuantity =
    orderItem?.filter((or) => or.product_id === item.id)?.[0]?.quantity || 0;

  const total_packaging = totalPackagingItem()[item.packaging_id]
    ? item.quantity - totalPackagingItem()[item.packaging_id]
    : item.quantity;

  const qtyStatus = () => {
    const remainingQuantity = item.product_quantity - currentQuantity;

    if (remainingQuantity === 0 || total_packaging === 0) {
      return "rgb(194, 64, 52)";
    } else if (
      (remainingQuantity >= 1 && remainingQuantity <= 5) ||
      (total_packaging >= 1 && total_packaging <= 5)
    ) {
      return "rgb(245, 199, 17)";
    } else {
      return "rgb(40, 128, 99)";
    }
  };

  const productStatus = () => {
    const remainingProduct = item.product_quantity - currentQuantity;
    if (remainingProduct > 5) {
      return "white";
    } else if (remainingProduct >= 1 && remainingProduct <= 5) {
      return "rgb(245, 199, 17)";
    } else {
      return "rgb(194,64,52)";
    }
  };

  const packagingStatus = () => {
    if (total_packaging > 5) {
      return "white";
    } else if (total_packaging >= 1 && total_packaging <= 5) {
      return "rgb(245, 199, 17)";
    } else {
      return "rgb(194,64,52)";
    }
  };

  return (
    <>
      <Col xs={24} md={12} xl={8}>
        <Card
          bordered={true}
          hoverable={true}
          style={{
            minWidth: "200px",
            borderLeft: `5px solid ${qtyStatus()}`,
          }}
          onClick={
            item.product_quantity - currentQuantity > 0 && total_packaging > 0
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
            style={{ margin: " 0 0 20px 0", color: "rgb(40,128,99)" }}
          >
            PHP {item.price}{" "}
          </Title>
          <Flex justify="space-between" align="center">
            <Flex vertical>
              <Text style={{ margin: 0, color: productStatus() }}>
                Qty: {item.product_quantity - currentQuantity}
              </Text>
              <Text style={{ margin: 0, color: packagingStatus() }}>
                Pkg Qty: {total_packaging}
              </Text>
            </Flex>
            <Badge
              dot={false}
              showZero={false}
              count={currentQuantity}
              color="rgb(245, 199, 17)"
              style={{
                position: "absolute",
                top: -130,
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
