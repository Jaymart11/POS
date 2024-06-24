// components/UpdatePackagingModal.js

import { Modal, Form, Input } from "antd";
import { useUpdatePackagingData } from "../../hooks/usePackagingData";
import useNotification from "../../hooks/useNotification";
import { useEffect } from "react";

const UpdatePackagingModal = ({ visible, onCancel, packaging }) => {
  console.log(packaging);
  const { mutate, isLoading, isError, error } = useUpdatePackagingData();
  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();

  useEffect(() => {
    if (packaging) {
      form.setFieldsValue(packaging);
    }
  }, [packaging, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (!isError) {
          mutate({ id: packaging.id, data: values });
          openNotificationWithIcon(
            "success",
            "Packaging update",
            "Packaging updated successfully!"
          );
          form.resetFields();
          onCancel();
        } else {
          openNotificationWithIcon(
            "error",
            "Packaging update failed!",
            error.message
          );
        }
      })
      .catch((info) => {
        openNotificationWithIcon("error", "Packaging update failed!", info);
      });
  };

  return (
    <>
      <Modal
        title="Update Packaging"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Update"
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          name="update_packaging"
          initialValues={packaging}
        >
          <Form.Item
            name="name"
            label="Packaging Name"
            rules={[
              { required: true, message: "Please input the packaging name!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdatePackagingModal;
