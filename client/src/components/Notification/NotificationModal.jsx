import { Modal, Button, Table, Typography, Tag } from "antd";
import CreateStockModal from "../../pages/Stock/CreateStockModal";
import { useState } from "react";

const NotificationModal = ({ visible, onCancel, data, isLoading }) => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [notifData, setNotifData] = useState();
  const user = JSON.parse(localStorage.getItem("user"));

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
  };
  const settingColumn = [
    {
      title: "Item Type",
      render: (_, record) => (
        <Typography>
          {record.item_type === "Packaging" ? (
            <Tag color="processing">Packaging</Tag>
          ) : (
            <Tag color="warning">Product</Tag>
          )}
        </Typography>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (rec) => (
        <Typography
          style={{
            color: rec !== 0 ? "rgb(245, 199, 17)" : "rgb(194, 64, 52)",
          }}
        >
          {rec}
        </Typography>
      ),
    },
    user?.access_level === 1
      ? {
          title: "Action",
          key: "action",
          render: (_, record) => (
            <Button
              type="primary"
              onClick={() => {
                showCreateModal();
                setNotifData(record);
              }}
            >
              Restock
            </Button>
          ),
        }
      : null,
  ];

  return (
    <>
      <CreateStockModal
        visible={isCreateModalVisible}
        onCancel={handleCancel}
        notifData={notifData}
      />
      <Modal
        title={
          <Typography
            style={{
              fontSize: "20px",
              color: data?.length ? "rgb(245, 199, 17)" : "rgb(40, 128, 99)",
            }}
          >
            {data?.length
              ? "Limited Stock Remaining"
              : "All Items Are Above The Threshold"}
          </Typography>
        }
        open={visible}
        onCancel={onCancel}
        confirmLoading={isLoading}
        centered={true}
        footer={null}
      >
        {!data?.length || (
          <Table columns={settingColumn.filter((s) => s)} dataSource={data} />
        )}
      </Modal>
    </>
  );
};

export default NotificationModal;
