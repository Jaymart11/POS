import { Button, Form, Input } from "antd";
import {
  useSettingData,
  useUpdateSettingData,
} from "../../hooks/useSettingData";
import useNotification from "../../hooks/useNotification";
import { useEffect } from "react";

const Settings = () => {
  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();
  const { data } = useSettingData();
  const { mutate } = useUpdateSettingData();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        mutate({
          id: data.id,
          data: values,
        });
        openNotificationWithIcon(
          "success",
          "Setting update",
          "Settings updated successfully!"
        );
        form.resetFields();
        localStorage.setItem("user", JSON.stringify({ ...user, ...values }));
      })
      .catch((info) => {
        openNotificationWithIcon("error", "Setting creation failed!", info);
      });
  };

  return (
    <Form
      form={form}
      name="setting"
      onFinish={onFinish}
      autoComplete="off"
      style={{ width: "100%", maxWidth: "400px" }}
      layout="vertical"
    >
      <Form.Item
        label="Stock Notification"
        name="stock_notification"
        rules={[
          {
            required: true,
            message: "Please input your stock notification!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Settings;
