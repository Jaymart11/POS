import { useContext, useState } from "react";
import {
  Table,
  Button,
  Flex,
  Card,
  Form,
  Segmented,
  Input,
  Popconfirm,
} from "antd";
import { OrderItemContext } from "../../stores/orderItemContext";
import { OrderContext } from "../../stores/orderContext";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useCreateOrderData } from "../../hooks/useOrderData";
import useNotification from "../../hooks/useNotification";

const OrderList = () => {
  const [form] = Form.useForm();
  const [change, setChange] = useState(0);
  const { mutate, isLoading } = useCreateOrderData();
  const openNotificationWithIcon = useNotification();
  const {
    orderItem,
    addItemToOrder,
    removeItemFromOrder,
    totalPayment,
    totalItems,
    setItemOrder,
  } = useContext(OrderItemContext);
  const { order, setOrder } = useContext(OrderContext);
  const user = JSON.parse(localStorage.getItem("user"));

  const columns = [
    {
      title: "Item",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, { product_id }) => (
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <Button
            type="primary"
            style={{ backgroundColor: "rgb(194,64,52)" }}
            shape="circle"
            onClick={() => removeItemFromOrder(product_id)}
          >
            <MinusOutlined />
          </Button>
          <p style={{ width: "20px", textAlign: "center" }}>{text}</p>
          <Button
            type="primary"
            shape="circle"
            style={{ backgroundColor: "rgb(40,128,99)" }}
            onClick={() => addItemToOrder({ product_id: product_id })}
          >
            <PlusOutlined />
          </Button>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price_at_order",
      key: "price_at_order",
      render: (_, { price_at_order, quantity }) => (
        <>
          <b>PHP {price_at_order * quantity}</b>
        </>
      ),
    },
  ];

  const onFinish = (f) => {
    mutate({
      orderData: {
        ...order,
        ...f,
        total_items: totalItems(),
        total_price: totalPayment() - (f.discount || 0),
      },
      items: orderItem.map(
        ({ product_id, packaging_details, quantity, price_at_order }) => ({
          product_id,
          packaging_details,
          quantity,
          price_at_order,
        })
      ),
    });
    openNotificationWithIcon("success", "Order Saved!", "");

    form.resetFields();
    setChange(0);
    setOrder({ order_type_id: 1, user_id: user.id, discount: 0 });
    setItemOrder([]);
  };

  const onFinishFailed = (errorInfo) => {
    openNotificationWithIcon("danger", "Order Failed!", errorInfo);
  };

  return (
    <>
      <Flex gap="small" wrap style={{ marginBottom: "10px" }}>
        <Button
          type={order.order_type_id === 1 ? "primary" : "default"}
          size={"large"}
          onClick={() => {
            form.setFieldValue("payment_method_id", 1);
            setOrder({ ...order, order_type_id: 1 });
          }}
        >
          Dine In
        </Button>
        <Button
          type={order.order_type_id === 2 ? "primary" : "default"}
          size={"large"}
          onClick={() => {
            form.setFieldValue("payment_method_id", 1);
            setOrder({ ...order, order_type_id: 2 });
          }}
        >
          Take Out
        </Button>
        <Button
          type={order.order_type_id === 3 ? "primary" : "default"}
          size={"large"}
          onClick={() => {
            setOrder({ ...order, order_type_id: 3 });
            form.setFieldValue("payment_method_id", 3);
          }}
        >
          Delivery
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={orderItem}
        pagination={false}
        locale={{ emptyText: "No Order Yet" }}
        scroll={{ x: "max-content" }}
      />
      <Card style={{ marginTop: "10px" }}>
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ payment_method_id: 1 }}
        >
          <Form.Item
            label="Discount"
            name="discount"
            initialValue={0}
            rules={[
              () => ({
                validator(_, value) {
                  const inputValue = parseInt(value);
                  const total = totalPayment();

                  if (inputValue <= total) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(`Discount must be less than ${total}.`)
                  );
                },
              }),
            ]}
          >
            <Input
              type="number"
              prefix="PHP"
              style={{ width: "100%" }}
              disabled={!orderItem.length}
              onChange={(e) => {
                const amount = form.getFieldValue("amount");
                setOrder({ ...order, discount: parseInt(e.target.value || 0) });
                if (amount) {
                  form.setFieldValue(
                    "amount",
                    totalPayment() - parseInt(e.target.value || 0)
                  );
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input the amount!",
              },
              () => ({
                validator(_, value) {
                  const inputValue = parseInt(value);
                  const total = totalPayment() - order.discount; // Assuming totalPayment is a function that returns a number
                  if (!isNaN(inputValue) && inputValue >= total) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(`Amount must be at least ${total}.`)
                  );
                },
              }),
            ]}
          >
            <Input
              type="number"
              style={{ width: "100%" }}
              prefix="PHP"
              disabled={!orderItem.length}
              onChange={(e) => {
                setChange(
                  parseInt(e.target.value) - (totalPayment() - order.discount)
                );
              }}
            />
          </Form.Item>

          <Form.Item name="payment_method_id">
            <Segmented
              options={
                order.order_type_id === 3
                  ? [
                      { label: "Panda", value: 3 },
                      { label: "Grab", value: 4 },
                    ]
                  : [
                      { label: "Cash", value: 1 },
                      { label: "GCash", value: 2 },
                    ]
              }
              block
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: "30px" }}>Total Payment</span>}
            style={{
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            <span style={{ fontSize: "30px" }}>
              PHP {totalPayment() - order.discount}
            </span>
          </Form.Item>
          {change <= 0 || !change ? (
            ""
          ) : (
            <Form.Item
              label={<span style={{ fontSize: "30px" }}>Change</span>}
              style={{
                textAlign: "right",
                fontWeight: "bold",
              }}
            >
              <span style={{ fontSize: "30px" }}>PHP {change}</span>
            </Form.Item>
          )}
          <Form.Item>
            <Popconfirm
              title="Save this order"
              description="Are you sure to save this order?"
              onConfirm={() => form.submit()}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                style={{ width: "100%" }}
                loading={isLoading}
                disabled={!orderItem.length}
              >
                Save
              </Button>
            </Popconfirm>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};
export default OrderList;
