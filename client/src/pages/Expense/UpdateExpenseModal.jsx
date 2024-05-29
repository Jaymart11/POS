// components/UpdateExpenseModal.js

import { Modal, Form, Input, Select } from "antd";
import { useUpdateExpenseData } from "../../hooks/useExpenseData";
import { useProductData } from "../../hooks/useProductData";
import { usePackagingData } from "../../hooks/usePackagingData";
import useNotification from "../../hooks/useNotification";
import { useEffect } from "react";

const UpdateExpenseModal = ({ visible, onCancel, expense }) => {
  const { mutate, isLoading, isError, error } = useUpdateExpenseData();
  const { data: prodData, isLoading: prodLoading } = useProductData();
  const { data: packData, isLoading: packLoading } = usePackagingData();
  const openNotificationWithIcon = useNotification();
  const [form] = Form.useForm();

  useEffect(() => {
    if (expense) {
      form.setFieldsValue(expense);
    }
  }, [expense, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (!isError) {
          mutate({ id: expense.id, data: values });
          openNotificationWithIcon(
            "success",
            "Expense update",
            "Expense updated successfully!"
          );
          form.resetFields();
          onCancel();
        } else {
          openNotificationWithIcon(
            "error",
            "Expense update failed!",
            error.message
          );
        }
      })
      .catch((info) => {
        openNotificationWithIcon("error", "Expense update failed!", info);
      });
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Modal
        title="Update Expense"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Update"
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          name="update_expense"
          initialValues={expense}
        >
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

export default UpdateExpenseModal;
