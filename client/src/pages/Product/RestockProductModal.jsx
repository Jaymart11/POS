import { Modal, Form, Input, Select } from "antd";
import { useUpdateProductData } from "../../hooks/useProductData";
import { useCreateStockData } from "../../hooks/useStockData";
import useNotification from "../../hooks/useNotification";
import { useEffect } from "react";

const RestockProductModal = ({
  visible,
  onCancel,
  setCurrentCategory,
  product,
}) => {
  const { mutate, isLoading } = useUpdateProductData();
  const { mutate: stockMutate, isLoading: stockLoading } = useCreateStockData();

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
        mutate({
          id: product.id,
          data: { ...values, ...product, updated_by: user.id },
        });

        stockMutate({
          product_id: product.id,
          quantity: values.quantity,
          type: values.restock,
          created_by: user.id,
        });
        openNotificationWithIcon(
          "success",
          "Stock adjustment",
          "Stock adjustment successfully!"
        );
        form.resetFields();
        onCancel();
        setCurrentCategory(product.category_id);
      })
      .catch((info) => {
        openNotificationWithIcon("error", "Stock adjustment failed!", info);
      });
  };

  return (
    <>
      <Modal
        title="Restock/Damaged Product"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Update"
        confirmLoading={isLoading}
        centered={true}
      >
        <Form form={form} layout="vertical" name="restock_product">
          <Form.Item
            name="restock"
            label="Action"
            rules={[
              {
                required: true,
                message: "Please select an action!",
              },
            ]}
          >
            <Select
              options={[
                {
                  label: "Restock",
                  value: "restock",
                },
                {
                  label: "Damaged",
                  value: "damaged",
                },
              ]}
            />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RestockProductModal;
