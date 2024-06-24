import { useState } from "react";
import {
  useExpenseData,
  useDeleteExpenseData,
} from "../../hooks/useExpenseData";
import CreateExpenseModal from "./CreateExpenseModal";
import UpdateExpenseModal from "./UpdateExpenseModal";
import { Space, Table, Button, Popconfirm, Typography } from "antd";
import useNotification from "../../hooks/useNotification";
import { format, isToday } from "date-fns";

const Expense = () => {
  const openNotificationWithIcon = useNotification();

  const { data, isLoading } = useExpenseData();
  const { mutate } = useDeleteExpenseData();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showUpdateModal = (expense) => {
    setCurrentExpense(expense);
    setIsUpdateModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    setCurrentExpense(null);
  };

  const confirmDelete = (id) => {
    mutate(id);

    openNotificationWithIcon(
      "success",
      "Expense deletion",
      "Expense deleted successfully!"
    );
  };

  const columns = [
    {
      title: "Item",
      render: (_, record) => (
        <Space size="middle">
          <Typography>
            {record.name || record.product_name || record.packaging_name}
          </Typography>
        </Space>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => (
        <Space size="middle">
          {text ? <Typography>PHP {text}</Typography> : ""}
        </Space>
      ),
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by",
    },
    {
      title: "Updated By",
      dataIndex: "updated_by",
      key: "updated_by",
    },
    {
      title: "Date",
      render: (_, record) => (
        <Space size="middle">
          <Typography>
            {format(
              new Date(record.updated_at || record.expense_date),
              "MMM dd, yyyy | hh:mm a"
            )}
          </Typography>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => showUpdateModal(record)}
            disabled={!isToday(new Date(record.expense_date))}
          >
            Update
          </Button>
          <Popconfirm
            title="Delete the expense"
            description="Are you sure to delete this expense?"
            onConfirm={() => confirmDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger disabled={!isToday(new Date(record.expense_date))}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <CreateExpenseModal
        visible={isCreateModalVisible}
        onCancel={handleCancel}
      />
      <UpdateExpenseModal
        visible={isUpdateModalVisible}
        onCancel={handleCancel}
        expense={currentExpense}
      />
      <Button
        style={{ marginBottom: "20px" }}
        type="primary"
        size="large"
        onClick={showCreateModal}
      >
        Create Expense
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default Expense;
