import { Card, Col, Typography, Badge, Flex } from "antd";
import { OrderItemContext } from "../../stores/orderItemContext";
import { useContext } from "react";

const { Text, Title } = Typography;

const MenuListItem = ({ item }) => {
  const { orderItem, addItemToOrder } = useContext(OrderItemContext);

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

  const qtyStatus = () => {
    if (item.product_quantity - currentQuantity > 5) {
      return "rgb(40,128,99)";
    } else if (
      item.product_quantity - currentQuantity >= 1 &&
      item.product_quantity - currentQuantity <= 5
    ) {
      return "rgb(245, 199, 17)";
    } else {
      return "rgb(194,64,52)";
    }
  };

  return (
    <>
      <Col lg={12} xl={8}>
        <Card
          bordered={true}
          hoverable={true}
          style={{
            // minWidth: "max-content",
            borderLeft: `5px solid ${qtyStatus()}`,
          }}
          onClick={
            item.product_quantity - currentQuantity > 0 ? handleAdd : null
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
            <Text style={{ margin: 0 }}>
              Qty: {item.product_quantity - currentQuantity}{" "}
            </Text>
            <Badge
              showZero={false}
              count={currentQuantity}
              color="rgb(245, 199, 17)"
              style={{
                position: "absolute",
                top: -120,
                right: -30,
                fontWeight: "bold",
              }}
            />
          </Flex>
        </Card>
      </Col>
    </>
  );
};

export default MenuListItem;
