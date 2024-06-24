// components/UpdateStockModal.js

import { Modal, Form, Input, Select } from "antd";
import { useUpdateStockData } from "../../hooks/useStockData";
import { useProductData } from "../../hooks/useProductData";
import { usePackagingData } from "../../hooks/usePackagingData";
import useNotification from "../../hooks/useNotification";
import { useEffect } from "react";

const UpdateStockModal = ({ visible, onCancel, stock }) => {
  const { mutate, isLoading, isError, error } = useUpdateStockData();
  const { data: prodData, isLoading: prodLoading } = useProductData();
  const { data: packData, isLoading: packLoading } = usePackagingData();
  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (stock) {
      form.setFieldsValue(stock);
    }
  }, [stock, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (!isError) {
          mutate({
            id: stock.id,
            data: {
              ...values,
              updated_by: user.id,
              prev_quantity: stock.quantity,
            },
          });
          openNotificationWithIcon(
            "success",
            "Stock update",
            "Stock updated successfully!"
          );
          form.resetFields();
          onCancel();
        } else {
          openNotificationWithIcon(
            "error",
            "Stock update failed!",
            error.message
          );
        }
      })
      .catch((info) => {
        openNotificationWithIcon("error", "Stock update failed!", info);
      });
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Modal
        title="Update Stock"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Update"
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          name="update_stock"
          initialValues={stock}
        >
          <Form.Item
            name="type"
            label="Action"
            rules={[{ required: true, message: "Please select a action!" }]}
          >
            <Select
              options={[
                { value: "restock", label: "Restock" },
                { value: "damaged", label: "Damaged" },
              ]}
            />
          </Form.Item>
          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.packaging_id !== currentValues.packaging_id
            }
            noStyle
          >
            {({ getFieldValue }) =>
              !getFieldValue("packaging_id") ? (
                <Form.Item name="product_id" label="Damaged Product">
                  <Select
                    disabled={true}
                    showSearch
                    filterOption={filterOption}
                    loading={prodLoading}
                    options={[
                      ...prodData.map(({ id, product_name }) => ({
                        value: id,
                        label: product_name,
                      })),
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
                    disabled={true}
                    options={[
                      ...packData.map(({ id, name }) => ({
                        value: id,
                        label: name,
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

export default UpdateStockModal;
