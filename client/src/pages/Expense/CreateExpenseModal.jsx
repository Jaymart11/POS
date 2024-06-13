import { Modal, Form, Input } from "antd";
import { useCreateExpenseData } from "../../hooks/useExpenseData";
import useNotification from "../../hooks/useNotification";

const CreateExpenseModal = ({ visible, onCancel }) => {
  const { mutate, isLoading } = useCreateExpenseData();
  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        mutate({ ...values, created_by: user.id });
        openNotificationWithIcon(
          "success",
          "Expense creation",
          "Expense created successfully!"
        );
        form.resetFields();
        onCancel();
      })
      .catch((info) => {
        openNotificationWithIcon("error", "Expense creation failed!", info);
      });
  };

  return (
    <>
      <Modal
        title="Create Expense/Damaged"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Create"
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical" name="create_expense">
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

export default CreateExpenseModal;
