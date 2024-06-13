// components/UpdateExpenseModal.js

import { Modal, Form, Input } from "antd";
import { useUpdateExpenseData } from "../../hooks/useExpenseData";
import useNotification from "../../hooks/useNotification";
import { useEffect } from "react";

const UpdateExpenseModal = ({ visible, onCancel, expense }) => {
  const { mutate, isLoading, isError, error } = useUpdateExpenseData();
  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (expense) {
      form.setFieldsValue(expense);
    }
  }, [expense, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (!isError) {
          mutate({ id: expense.id, data: { ...values, updated_by: user.id } });
          openNotificationWithIcon(
            "success",
            "Expense update",
            "Expense updated successfully!"
          );
          form.resetFields();
          onCancel();
        } else {
          openNotificationWithIcon(
            "error",
            "Expense update failed!",
            error.message
          );
        }
      })
      .catch((info) => {
        openNotificationWithIcon("error", "Expense update failed!", info);
      });
  };

  return (
    <>
      <Modal
        title="Update Expense"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Update"
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          name="update_expense"
          initialValues={expense}
        >
          <Form.Item name="name" label="Expense Name">
            <Input />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please input the Amount!" }]}
          >
            <Input type="number" prefix="PHP" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateExpenseModal;
