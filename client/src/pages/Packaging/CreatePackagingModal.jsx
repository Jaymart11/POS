import { Modal, Form, Input } from "antd";
import { useCreatePackagingData } from "../../hooks/usePackagingData";
import useNotification from "../../hooks/useNotification";

const CreatePackagingModal = ({ visible, onCancel }) => {
  const { mutate, isLoading } = useCreatePackagingData();
  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        mutate(values);
        openNotificationWithIcon(
          "success",
          "Packaging creation",
          "Packaging created successfully!"
        );
        form.resetFields();
        onCancel();
      })
      .catch((info) => {
        openNotificationWithIcon("danger", "Packaging creation failed!", info);
      });
  };

  return (
    <>
      <Modal
        title="Create Packaging"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Create"
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical" name="create_packaging">
          <Form.Item
            name="name"
            label="Packaging Name"
            rules={[
              { required: true, message: "Please input the packaging name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreatePackagingModal;
