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
          <Col sm={24} md={14}>
            <MenuList />
          </Col>
          <Col sm={24} md={10}>
            <OrderList />
          </Col>
        </Row>
      </OrderItemProvider>
    </OrderProvider>
  );
};

export default Menu;
