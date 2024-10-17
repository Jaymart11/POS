import { useState } from "react";
import { useStockData, useDeleteStockData } from "../../hooks/useStockData";
import CreateStockModal from "./CreateStockModal";
import UpdateStockModal from "./UpdateStockModal";
import { Space, Table, Button, Popconfirm, Typography, Tag } from "antd";
import useNotification from "../../hooks/useNotification";
import { format, isToday } from "date-fns";

const Stock = () => {
  const openNotificationWithIcon = useNotification();

  const { data, isLoading } = useStockData();
  const { mutate } = useDeleteStockData();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showUpdateModal = (stock) => {
    setCurrentStock(stock);
    setIsUpdateModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    setCurrentStock(null);
  };

  const confirmDelete = (id) => {
    mutate({
      id,
      data: {
        deleted_by: user.id,
        deleted_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      },
    });

    openNotificationWithIcon(
      "success",
      "Stock deletion",
      "Stock deleted successfully!"
    );
  };

  const columns = [
    {
      title: "Item",
      render: (_, record) => (
        <Space size="middle">
          <Typography>
            {record.product_name || record.packaging_name}
          </Typography>
        </Space>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
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
      render: (_, record) => (
        <Typography
          style={{ color: record.deleted_by != null ? "red" : "white" }}
        >
          {record.deleted_by || record.updated_by}
        </Typography>
      ),
    },
    {
      title: "Date",
      render: (_, record) => (
        <Space size="middle">
          <Typography
            style={{ color: record.deleted_by != null ? "red" : "white" }}
          >
            {format(
              new Date(
                record.deleted_at ||
                  record.updated_at ||
                  record.transaction_date
              ),
              "MMM dd, yyyy | hh:mm a"
            )}
          </Typography>
        </Space>
      ),
    },
    {
      title: "Type",
      render: (_, record) => (
        <Space size="middle">
          <Typography>
            {record.packaging_id ? (
              <Tag color="processing">Packaging</Tag>
            ) : (
              <Tag color="warning">Product</Tag>
            )}
            {record.type === "restock" ? (
              <Tag color="success">Restock</Tag>
            ) : (
              <Tag color="error">Damaged</Tag>
            )}
          </Typography>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return record.deleted_by != null ? (
          <b style={{ color: "red" }}>VOIDED</b>
        ) : (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => showUpdateModal(record)}
              disabled={!isToday(new Date(record.transaction_date))}
            >
              Update
            </Button>
            <Popconfirm
              title="Delete the stock"
              description="Are you sure to delete this stock?"
              onConfirm={() => confirmDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                disabled={!isToday(new Date(record.transaction_date))}
              >
                Void
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <CreateStockModal
        visible={isCreateModalVisible}
        onCancel={handleCancel}
      />
      <UpdateStockModal
        visible={isUpdateModalVisible}
        onCancel={handleCancel}
        stock={currentStock}
      />
      <Button
        style={{ marginBottom: "20px" }}
        type="primary"
        size="large"
        onClick={showCreateModal}
      >
        Create Stock Adjustments
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

export default Stock;
