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
import { isToday, format } from "date-fns";
import useNotification from "../../hooks/useNotification";

const { RangePicker } = DatePicker;

const rangePresets = [
  {
    label: "Today",
    value: () => [dayjs().startOf("day"), dayjs().endOf("day")],
  },
  {
    label: "Last 7 Days",
    value: [dayjs().startOf("day").add(-7, "d"), dayjs().endOf("day")],
  },
  {
    label: "Last 14 Days",
    value: [dayjs().startOf("day").add(-14, "d"), dayjs().endOf("day")],
  },
  {
    label: "Last 30 Days",
    value: [dayjs().startOf("day").add(-30, "d"), dayjs().endOf("day")],
  },
  {
    label: "Last 90 Days",
    value: [dayjs().startOf("day").add(-90, "d"), dayjs().endOf("day")],
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
        dayjs(date[0]).format("YYYY-MM-DD HH:mm:ss"),
        dayjs(date[1]).format("YYYY-MM-DD HH:mm:ss"),
      ],
      user_id: user.access_level == 2 ? user.id : user_id,
    });
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const confirmDelete = (id) => {
    mutate({
      id,
      data: {
        deleted_by: user.id,
        deleted_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        status_id: 2,
      },
    });

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
      title: "Date Ordered / Deleted",
      render: (_, record) => (
        <Space size="middle">
          <Typography
            style={{ color: record.deleted_by != null ? "red" : "white" }}
          >
            {record.deleted_by === null
              ? dayjs(record.order_date.slice(0, -1)).format(
                  "MMM DD, YYYY | hh:mm A"
                )
              : dayjs(record.deleted_at.slice(0, -1)).format(
                  "MMM DD, YYYY | hh:mm A"
                )}
          </Typography>
        </Space>
      ),
    },
    {
      title: "Updated by",
      render: (_, record) => (
        <Space size="middle">
          <Typography
            style={{ color: record.deleted_by != null ? "red" : "white" }}
          >
            {record.deleted_by}
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
          <Popconfirm
            title="Delete the stock"
            description="Are you sure to delete this stock?"
            onConfirm={() => confirmDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              disabled={
                !isToday(new Date(record.order_date)) ||
                record.deleted_by !== null
              }
            >
              Void
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
                showTime={{ format: "hh:mm A" }}
                format="YYYY-MM-DD hh:mm A"
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
                  options={[
                    { label: "All", value: 0 },
                    ...(data?.map((val) => ({
                      label: `${val.first_name} ${val.last_name}`,
                      value: val.id,
                    })) || []),
                  ]}
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
