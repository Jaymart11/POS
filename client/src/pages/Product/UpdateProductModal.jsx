import { Modal, Form, Input, Select } from "antd";
import { useUpdateProductData } from "../../hooks/useProductData";
import { useCategoryData } from "../../hooks/useCategoryData";
import { usePackagingData } from "../../hooks/usePackagingData";
import useNotification from "../../hooks/useNotification";
import { useEffect } from "react";

const CreateProductModal = ({
  visible,
  onCancel,
  setCurrentCategory,
  product,
}) => {
  const { mutate, isLoading } = useUpdateProductData();
  const { data: catData, isLoading: catLoading } = useCategoryData();
  const { data: packData, isLoading: packLoading } = usePackagingData();

  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    }
  }, [product, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        mutate({ id: product.id, data: { ...values, updated_by: user.id } });
        openNotificationWithIcon(
          "success",
          "Product creation",
          "Product created successfully!"
        );
        form.resetFields();
        onCancel();
        setCurrentCategory(values.category_id);
      })
      .catch((info) => {
        openNotificationWithIcon("error", "Product creation failed!", info);
      });
  };

  return (
    <>
      <Modal
        title="Create Product"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Update"
        confirmLoading={isLoading}
        centered={true}
      >
        <Form form={form} layout="vertical" name="create_product">
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: "Please input the code!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="product_name"
            label="Name"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="product_quantity" label="Quantity">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <Input />
          </Form.Item>
          <Form.Item
            name="category_id"
            label="Category"
            rules={[
              {
                required: true,
                message: "Please select a category!",
              },
            ]}
          >
            <Select
              loading={catLoading}
              options={catData?.map((cat) => ({
                label: cat.name,
                value: cat.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="packaging_id"
            label="Packaging"
            rules={[
              {
                required: true,
                message: "Please select a packaging!",
              },
            ]}
          >
            <Select
              loading={packLoading}
              options={packData?.map((pack) => ({
                label: pack.name,
                value: pack.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateProductModal;
