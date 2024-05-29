import { Modal, Form, Input, Select } from "antd";
import { useCreateUserData } from "../../hooks/useUserData";
import useNotification from "../../hooks/useNotification";

const CreateUserModal = ({ visible, onCancel }) => {
  const { mutate, isLoading } = useCreateUserData();
  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        mutate(values);
        openNotificationWithIcon(
          "success",
          "User creation",
          "User created successfully!"
        );
        form.resetFields();
        onCancel();
      })
      .catch((info) => {
        openNotificationWithIcon("error", "User creation failed!", info);
      });
  };

  return (
    <>
      <Modal
        title="Create User"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Create"
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          name="create_user"
          initialValues={{ access_level_id: 1 }}
        >
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              { required: true, message: "Please input the first name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: "Please input the last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input the password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="access_level_id"
            label="Access Level"
            rules={[
              {
                required: true,
                message: "Please select a access_level!",
              },
            ]}
          >
            <Select
              options={[
                {
                  value: 1,
                  label: "Admin",
                },
                {
                  value: 2,
                  label: "Cashier",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUserModal;
