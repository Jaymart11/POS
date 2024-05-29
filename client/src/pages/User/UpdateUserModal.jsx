// components/UpdateUserModal.js

import { Modal, Form, Input, Select } from "antd";
import { useUpdateUserData } from "../../hooks/useUserData";
import useNotification from "../../hooks/useNotification";
import { useEffect } from "react";

const UpdateUserModal = ({ visible, onCancel, user }) => {
  const { mutate, isLoading, isError, error } = useUpdateUserData();
  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (!isError) {
          mutate({ id: user.id, data: values });
          openNotificationWithIcon(
            "success",
            "User update",
            "User updated successfully!"
          );
          form.resetFields();
          onCancel();
        } else {
          openNotificationWithIcon(
            "error",
            "User update failed!",
            error.message
          );
        }
      })
      .catch((info) => {
        openNotificationWithIcon("error", "User update failed!", info);
      });
  };

  return (
    <>
      <Modal
        title="Update User"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Update"
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          name="update_user"
          initialValues={user}
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

export default UpdateUserModal;
