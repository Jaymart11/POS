import { Button, DatePicker, Form, Select } from "antd";
import dayjs from "dayjs";
import { useUserData } from "../../hooks/useUserData";
import { downloadReport } from "../../services/orderService";

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

  const user = JSON.parse(localStorage.getItem("user"));

  const onFinish = ({ date, user_id }) => {
    downloadReport({
      date: [
        dayjs(date[0]).format("YYYY-MM-DD"),
        dayjs(date[1]).format("YYYY-MM-DD"),
      ],
      user_id,
    });
  };
  return (
    <Form
      onFinish={onFinish}
      layout="vertical"
      name="download"
      initialValues={{ user_id: user.access_level == 2 ? user.id : undefined }}
    >
      <Form.Item name="date" rules={[{ required: true }]}>
        <RangePicker
          presets={rangePresets}
          disabledDate={(current) => current && current > dayjs().endOf("day")}
        />
      </Form.Item>
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
          loading={isLoading}
          options={data?.map((val) => ({
            label: val.first_name + " " + val.last_name,
            value: val.id,
          }))}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Download
      </Button>
    </Form>
  );
};
export default Report;
