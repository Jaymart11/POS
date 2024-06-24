import {
  Button,
  Col,
  DatePicker,
  Space,
  Form,
  Row,
  Select,
  Popconfirm,
  Typography,
  Tag,
  Table,
} from "antd";
import dayjs from "dayjs";
import { useUserData } from "../../hooks/useUserData";
import { downloadReport } from "../../services/orderService";
import { useDeleteOrderData, useOrderData } from "../../hooks/useOrderData";
import { format, isToday } from "date-fns";
import useNotification from "../../hooks/useNotification";

const { RangePicker } = DatePicker;

const rangePresets = [
  {
    label: "Today",
    value: () => [dayjs(), dayjs().endOf("day")],
  },
  {
    label: "Last 7 Days",
    value: [dayjs().add(-7, "d"), dayjs()],
  },
  {
    label: "Last 14 Days",
    value: [dayjs().add(-14, "d"), dayjs()],
  },
  {
    label: "Last 30 Days",
    value: [dayjs().add(-30, "d"), dayjs()],
  },
  {
    label: "Last 90 Days",
    value: [dayjs().add(-90, "d"), dayjs()],
  },
];

const Report = () => {
  const { data, isLoading } = useUserData();
  const { data: orderData, isLoading: orderLoading } = useOrderData();
  const { mutate } = useDeleteOrderData();

  const user = JSON.parse(localStorage.getItem("user"));
  const openNotificationWithIcon = useNotification();

  const onFinish = ({ date, user_id }) => {
    downloadReport({
      date: [
        dayjs(date[0]).format("YYYY-MM-DD"),
        dayjs(date[1]).format("YYYY-MM-DD"),
      ],
      user_id: user.access_level == 2 ? user.id : user_id,
    });
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const confirmDelete = (id) => {
    mutate(id);

    openNotificationWithIcon(
      "success",
      "User deletion",
      "User deleted successfully!"
    );
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Cashier",
      dataIndex: "employee",
      key: "employee",
    },
    {
      title: "Order Type",
      dataIndex: "order_type",
      key: "order_type",
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Total Items",
      dataIndex: "total_items",
      key: "total_items",
    },
    {
      title: "Discount",
      render: (_, record) => (
        <Space size="middle">
          <Typography>PHP {record.discount}.00</Typography>
        </Space>
      ),
    },
    {
      title: "Total Price",
      render: (_, record) => (
        <Space size="middle">
          <Typography>PHP {record.total_price}</Typography>
        </Space>
      ),
    },
    {
      title: "Date Ordered",
      render: (_, record) => (
        <Space size="middle">
          <Typography>
            {format(new Date(record.order_date), "MMM dd, yyyy | hh:mm a")}
          </Typography>
        </Space>
      ),
    },
    {
      title: "Type",
      render: (_, record) => (
        <Space size="middle">
          <Typography>
            <Tag color={record.status === "Completed" ? "success" : "error"}>
              {record.status}
            </Tag>
          </Typography>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <Button
            type="primary"
            onClick={() => showUpdateModal(record)}
            disabled={!isToday(new Date(record.transaction_date))}
          >
            Update
          </Button> */}
          <Popconfirm
            title="Delete the stock"
            description="Are you sure to delete this stock?"
            onConfirm={() => confirmDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger disabled={!isToday(new Date(record.order_date))}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Form
        onFinish={onFinish}
        layout="vertical"
        name="download"
        initialValues={{
          user_id: user.access_level == 2 ? user.id : undefined,
        }}
      >
        <Row gutter={[16]}>
          <Col span={3}></Col>
          <Col xs={24} lg={8}>
            <Form.Item
              label="Date Range"
              name="date"
              rules={[{ required: true }]}
            >
              <RangePicker
                style={{ width: "100%" }}
                presets={rangePresets}
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>
          </Col>
          {user.access_level != 2 && (
            <Col xs={24} lg={8}>
              <Form.Item
                name="user_id"
                label="Cashier"
                rules={[
                  {
                    required: true,
                    message: "Please select a cashier!",
                  },
                ]}
              >
                <Select
                  showSearch
                  filterOption={filterOption}
                  loading={isLoading}
                  options={data?.map((val) => ({
                    label: val.first_name + " " + val.last_name,
                    value: val.id,
                  }))}
                />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} lg={3}>
            <Form.Item
              style={{ display: "flex", alignItems: "center", height: "105%" }}
            >
              <Button type="primary" htmlType="submit">
                Download
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        columns={columns}
        dataSource={orderData}
        loading={orderLoading}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};
export default Report;
