import { Modal, Form, Input, Select } from "antd";
import { useCreateExpenseData } from "../../hooks/useExpenseData";
import { useProductData } from "../../hooks/useProductData";
import { usePackagingData } from "../../hooks/usePackagingData";
import useNotification from "../../hooks/useNotification";

const CreateExpenseModal = ({ visible, onCancel }) => {
  const { mutate, isLoading } = useCreateExpenseData();
  const { data: prodData, isLoading: prodLoading } = useProductData();
  const { data: packData, isLoading: packLoading } = usePackagingData();
  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        mutate(values);
        openNotificationWithIcon(
          "success",
          "Expense creation",
          "Expense created successfully!"
        );
        form.resetFields();
        onCancel();
      })
      .catch((info) => {
        openNotificationWithIcon("error", "Expense creation failed!", info);
      });
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Modal
        title="Create Expense/Damaged"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Create"
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical" name="create_expense">
          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.product_id !== currentValues.product_id ||
              prevValues.packaging_id !== currentValues.packaging_id
            }
            noStyle
          >
            {({ getFieldValue }) =>
              !getFieldValue("product_id") && !getFieldValue("packaging_id") ? (
                <Form.Item name="name" label="Expense Name">
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.name !== currentValues.name ||
              prevValues.packaging_id !== currentValues.packaging_id
            }
            noStyle
          >
            {({ getFieldValue }) =>
              !getFieldValue("name") && !getFieldValue("packaging_id") ? (
                <Form.Item name="product_id" label="Damaged Product">
                  <Select
                    showSearch
                    filterOption={filterOption}
                    loading={prodLoading}
                    options={[
                      {
                        value: 0,
                        label: " ",
                      },
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
              prevValues.name !== currentValues.name ||
              prevValues.product_id !== currentValues.product_id
            }
            noStyle
          >
            {({ getFieldValue }) =>
              !getFieldValue("name") && !getFieldValue("product_id") ? (
                <Form.Item name="packaging_id" label="Damaged Packaging">
                  <Select
                    showSearch
                    filterOption={filterOption}
                    loading={packLoading}
                    options={[
                      {
                        value: 0,
                        label: " ",
                      },
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

          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.name !== currentValues.name
            }
            noStyle
          >
            {({ getFieldValue }) =>
              getFieldValue("name") ? (
                <Form.Item
                  name="amount"
                  label="Amount"
                  rules={[
                    { required: true, message: "Please input the Amount!" },
                  ]}
                >
                  <Input type="number" prefix="PHP" />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.product_id !== currentValues.product_id ||
              prevValues.packaging_id !== currentValues.packaging_id
            }
            noStyle
          >
            {({ getFieldValue }) =>
              getFieldValue("product_id") || getFieldValue("packaging_id") ? (
                <Form.Item
                  name="quantity"
                  label="Quantity"
                  rules={[
                    { required: true, message: "Please input the Quantity!" },
                  ]}
                >
                  <Input type="number" />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateExpenseModal;
