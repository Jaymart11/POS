import { Modal, Form, Input, Select } from "antd";
import { useCreateStockData } from "../../hooks/useStockData";
import useNotification from "../../hooks/useNotification";
import { useEffect } from "react";

const RestockPackagingModal = ({ visible, onCancel, packaging }) => {
  const { mutate: stockMutate, isLoading } = useCreateStockData();

  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (packaging) {
      form.setFieldsValue(packaging);
    }
  }, [packaging, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        stockMutate({
          packaging_id: packaging.id,
          quantity: values.packaging_quantity,
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
      })
      .catch((info) => {
        openNotificationWithIcon("error", "Stock adjustment failed!", info);
      });
  };

  return (
    <>
      <Modal
        title="Restock/Damaged Packaging"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Update"
        confirmLoading={isLoading}
        centered={true}
      >
        <Form form={form} layout="vertical" name="restock_packaging">
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
              onChange={(val) => {
                form.setFieldValue("quantity", val);
              }}
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
          <Form.Item dependencies={["restock"]}>
            {({ getFieldValue }) => (
              <Form.Item
                name="packaging_quantity"
                label="Quantity"
                rules={[
                  { required: true, message: "Please input the Quantity!" },
                  {
                    validator: (_, value) => {
                      if (value < 1) {
                        return Promise.reject(
                          new Error(`Quantity must have atleast 1!`)
                        );
                      } else if (
                        parseInt(value) > packaging.quantity &&
                        getFieldValue("restock") !== "restock"
                      ) {
                        return Promise.reject(
                          new Error(
                            `The quantity cannot exceed ${packaging.quantity}!`
                          )
                        );
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RestockPackagingModal;
