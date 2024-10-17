import { Modal, Form, Input, Select, Button } from "antd";
import { useCreateProductData } from "../../hooks/useProductData";
import { useCategoryData } from "../../hooks/useCategoryData";
import { usePackagingData } from "../../hooks/usePackagingData";
import useNotification from "../../hooks/useNotification";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const CreateProductModal = ({ visible, onCancel, setCurrentCategory }) => {
  const { mutate, isLoading } = useCreateProductData();
  const { data: catData } = useCategoryData();
  const { data: packData } = usePackagingData();

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
        okText="Create"
        confirmLoading={isLoading}
        centered={true}
      >
        <Form
          form={form}
          layout="vertical"
          name="create_product"
          initialValues={{
            packaging: [{}], // Add one default packaging field
          }}
        >
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
              options={catData?.map((cat) => ({
                label: cat.name,
                value: cat.id,
              }))}
            />
          </Form.Item>
          {/* <Form.Item
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
              options={packData?.map((pack) => ({
                label: pack.name,
                value: pack.id,
              }))}
            />
          </Form.Item> */}
          <Form.List name="packaging">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
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
                        options={packData
                          ?.filter(
                            (item) =>
                              !form
                                .getFieldValue(["packaging"])
                                .includes(item.id)
                          )
                          ?.map((pack) => ({
                            label: pack.name,
                            value: pack.id,
                          }))}
                      />
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
                    Add packaging field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
};

export default CreateProductModal;
