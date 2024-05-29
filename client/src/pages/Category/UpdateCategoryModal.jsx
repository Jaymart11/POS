// components/UpdateCategoryModal.js

import { Modal, Form, Input } from "antd";
import { useUpdateCategoryData } from "../../hooks/useCategoryData";
import useNotification from "../../hooks/useNotification";
import { useEffect } from "react";

const UpdateCategoryModal = ({ visible, onCancel, category }) => {
  const { mutate, isLoading, isError, error } = useUpdateCategoryData();
  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();

  useEffect(() => {
    if (category) {
      form.setFieldsValue(category);
    }
  }, [category, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (!isError) {
          mutate({ id: category.id, data: values });
          openNotificationWithIcon(
            "success",
            "Category update",
            "Category updated successfully!"
          );
          form.resetFields();
          onCancel();
        } else {
          openNotificationWithIcon(
            "error",
            "Category update failed!",
            error.message
          );
        }
      })
      .catch((info) => {
        openNotificationWithIcon("error", "Category update failed!", info);
      });
  };

  return (
    <>
      <Modal
        title="Update Category"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Update"
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          name="update_category"
          initialValues={category}
        >
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

export default UpdateCategoryModal;
