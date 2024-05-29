import { Row, Col } from "antd";
import MenuList from "./MenuList";
import OrderList from "./OrderList";
import { OrderItemProvider } from "../../stores/orderItemContext";
import { OrderProvider } from "../../stores/orderContext";
const Menu = () => {
  return (
    <OrderProvider>
      <OrderItemProvider>
        <Row gutter={[16, 16]}>
          <Col span={14}>
            <MenuList />
          </Col>
          <Col span={10}>
            <OrderList />
          </Col>
        </Row>
      </OrderItemProvider>
    </OrderProvider>
  );
};

export default Menu;
