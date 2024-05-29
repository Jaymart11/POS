import { Modal, Form, Input } from "antd";
import { useCreateCategoryData } from "../../hooks/useCategoryData";
import useNotification from "../../hooks/useNotification";

const CreateCategoryModal = ({ visible, onCancel }) => {
  const { mutate, isLoading } = useCreateCategoryData();
  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        mutate(values);
        openNotificationWithIcon(
          "success",
          "Category creation",
          "Category created successfully!"
        );
        form.resetFields();
        onCancel();
      })
      .catch((info) => {
        openNotificationWithIcon("danger", "Category creation failed!", info);
      });
  };

  return (
    <>
      <Modal
        title="Create Category"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Create"
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical" name="create_category">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please input the category name!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateCategoryModal;
