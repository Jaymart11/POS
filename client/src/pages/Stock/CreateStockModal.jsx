import { Modal, Form, Input, Select } from "antd";
import { useCreateStockData } from "../../hooks/useStockData";
import { useProductData } from "../../hooks/useProductData";
import { usePackagingData } from "../../hooks/usePackagingData";
import useNotification from "../../hooks/useNotification";

const CreateStockModal = ({ visible, onCancel }) => {
  const { mutate, isLoading } = useCreateStockData();
  const { data: prodData, isLoading: prodLoading } = useProductData();
  const { data: packData, isLoading: packLoading } = usePackagingData();
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
          "Stock creation",
          "Stock created successfully!"
        );
        form.resetFields();
        onCancel();
      })
      .catch((info) => {
        openNotificationWithIcon("error", "Stock creation failed!", info);
      });
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Modal
        title="Create Stock/Damaged"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Create"
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical" name="create_stock">
          <Form.Item
            name="type"
            label="Action"
            rules={[{ required: true, message: "Please select a action!" }]}
          >
            <Select
              onChange={() => {
                form.setFieldValue("quantity", undefined);
              }}
              options={[
                { value: "restock", label: "Restock" },
                { value: "damaged", label: "Damaged" },
              ]}
            />
          </Form.Item>
          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.name !== currentValues.name ||
              prevValues.packaging_id !== currentValues.packaging_id
            }
            noStyle
          >
            {({ getFieldValue }) =>
              !getFieldValue("packaging_id") ? (
                <Form.Item name="product_id" label="Damaged Product">
                  <Select
                    showSearch
                    filterOption={filterOption}
                    loading={prodLoading}
                    onChange={() => {
                      form.setFieldValue("quantity", undefined);
                    }}
                    options={[
                      {
                        value: 0,
                        label: " ",
                      },
                      ...prodData.map(
                        ({ id, product_name, product_quantity }) => ({
                          value: id,
                          label: `${product_name} - ${product_quantity} pcs.`,
                        })
                      ),
                    ]}
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.product_id !== currentValues.product_id
            }
            noStyle
          >
            {({ getFieldValue }) =>
              !getFieldValue("product_id") ? (
                <Form.Item name="packaging_id" label="Damaged Packaging">
                  <Select
                    showSearch
                    filterOption={filterOption}
                    loading={packLoading}
                    onChange={() => {
                      form.setFieldValue("quantity", undefined);
                    }}
                    options={[
                      {
                        value: 0,
                        label: " ",
                      },
                      ...packData.map(({ id, name, quantity }) => ({
                        value: id,
                        label: `${name} - ${quantity} pcs.`,
                      })),
                    ]}
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item dependencies={["product_id", "packaging_id"]}>
            {({ getFieldValue }) => (
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[
                  { required: true, message: "Please input the Quantity!" },
                  {
                    validator: (_, value) => {
                      if (value < 1)
                        return Promise.reject(
                          new Error(`Quantity must have atleast 1!`)
                        );
                      const maxVal = getFieldValue("product_id")
                        ? prodData.filter(
                            ({ id }) => id === getFieldValue("product_id")
                          )[0].product_quantity
                        : packData.filter(
                            ({ id }) => id === getFieldValue("packaging_id")
                          )[0].quantity;
                      return parseInt(value) > maxVal &&
                        getFieldValue("type") !== "restock"
                        ? Promise.reject(
                            new Error(`The quantity cannot exceed ${maxVal}!`)
                          )
                        : Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  type="number"
                  disabled={
                    !getFieldValue("product_id") &&
                    !getFieldValue("packaging_id")
                  }
                />
              </Form.Item>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateStockModal;
