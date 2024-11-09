import { Modal, Form, Input, Select, Button, InputNumber } from "antd";
import {
  useUpdateProductData,
  useProductData,
} from "../../hooks/useProductData";
import { useCategoryData } from "../../hooks/useCategoryData";
import { usePackagingData } from "../../hooks/usePackagingData";
import useNotification from "../../hooks/useNotification";
import { useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const CreateProductModal = ({
  visible,
  onCancel,
  setCurrentCategory,
  product,
}) => {
  const { mutate, isLoading } = useUpdateProductData();
  const { data: catData, isLoading: catLoading } = useCategoryData();
  const { data: packData, isLoading: packLoading } = usePackagingData();
  const { data: prodData, isLoading: prodLoading } = useProductData();

  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        packaging: [...product.packaging_details.map((p) => p.packaging_id)],
        packaging_details: undefined,
        product_conversion: product.product_conversion.some((item) =>
          Object.values(item).some((value) => value === null)
        )
          ? undefined
          : product.product_conversion,
      });
    }
  }, [product, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log({
          id: product.id,
          data: { ...values, updated_by: user.id },
        });
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
        title="Update Product"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Update"
        confirmLoading={isLoading}
        centered={true}
      >
        <Form form={form} layout="vertical" name="update_product">
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
          {/* <Form.Item name="product_quantity" label="Quantity">
            <Input />
          </Form.Item> */}
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
          <Form.List name="packaging">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => {
                  console.log(field);
                  return (
                    <Form.Item
                      label={
                        <>
                          Packaging {field.name + 1} &nbsp;&nbsp;
                          <MinusCircleOutlined
                            style={{ color: "red" }}
                            onClick={() => remove(field.name)}
                          />
                        </>
                      }
                      required={false}
                      key={field.key}
                    >
                      <Form.Item
                        {...field}
                        rules={[
                          {
                            required: true,
                            message: "Please select a packaging!",
                          },
                        ]}
                        noStyle
                      >
                        <Select
                          loading={packLoading}
                          options={packData.map((pack) => ({
                            label: pack.name,
                            value: pack.id,
                          }))}
                        />
                      </Form.Item>
                    </Form.Item>
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    style={{ width: "100%" }}
                    icon={<PlusOutlined />}
                  >
                    Add packaging field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.List name="product_conversion">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ name, ...field }) => (
                  <Form.Item
                    label={
                      <>
                        Product Conversion {name + 1} &nbsp;&nbsp;
                        <MinusCircleOutlined
                          style={{ color: "red" }}
                          onClick={() => remove(name)}
                        />
                      </>
                    }
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      name={[name, "conversion_product_id"]}
                      rules={[
                        {
                          required: true,
                          message: "Please select a product!",
                        },
                      ]}
                    >
                      <Select
                        loading={prodLoading}
                        options={prodData
                          .filter(({ id }) => id !== product.id)
                          ?.map((pack) => ({
                            label: pack.product_name,
                            value: pack.id,
                          }))}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Conversion ratio"
                      {...field}
                      name={[name, "conversion_ratio"]}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      noStyle
                    >
                      <InputNumber step="0.1" style={{ width: "100%" }} />
                    </Form.Item>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    style={{ width: "100%" }}
                    icon={<PlusOutlined />}
                  >
                    Add conversion field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item name="stock_notification" label="Stock Notification">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateProductModal;
