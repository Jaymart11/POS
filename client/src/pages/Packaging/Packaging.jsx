import { useState } from "react";
import { usePackagingData } from "../../hooks/usePackagingData";
import { useUpdatePackagingData } from "../../hooks/usePackagingData";
import CreatePackagingModal from "./CreatePackagingModal";
import UpdatePackagingModal from "./UpdatePackagingModal";
import { Space, Table, Button, Popconfirm } from "antd";
import useNotification from "../../hooks/useNotification";
import { format } from "date-fns";

const Packaging = () => {
  const openNotificationWithIcon = useNotification();
  const user = JSON.parse(localStorage.getItem("user"));
  const { data, isLoading } = usePackagingData();
  const { mutate } = useUpdatePackagingData();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentPackaging, setCurrentPackaging] = useState(null);

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showUpdateModal = (packaging) => {
    setCurrentPackaging(packaging);
    setIsUpdateModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    setCurrentPackaging(null);
  };

  const confirmDelete = (id) => {
    try {
      mutate({
        id,
        data: {
          deleted_by: user.id,
          deleted_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        },
      });

      openNotificationWithIcon(
        "success",
        "Packaging deletion",
        "Packaging deleted successfully!"
      );
    } catch (e) {
      openNotificationWithIcon(
        "error",
        "Packaging deletion",
        "Packaging deleted failed!"
      );
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showUpdateModal(record)}>
            Update
          </Button>
          <Popconfirm
            title="Delete the packaging"
            description="Are you sure to delete this packaging?"
            onConfirm={() => confirmDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <CreatePackagingModal
        visible={isCreateModalVisible}
        onCancel={handleCancel}
      />
      <UpdatePackagingModal
        visible={isUpdateModalVisible}
        onCancel={handleCancel}
        packaging={currentPackaging}
      />
      <Button
        style={{ marginBottom: "20px" }}
        type="primary"
        size="large"
        onClick={showCreateModal}
      >
        Create Packaging
      </Button>
      <Table columns={columns} dataSource={data} loading={isLoading} />
    </>
  );
};

export default Packaging;
