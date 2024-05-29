import { useState } from "react";
import {
  usePackagingData,
  useDeletePackagingData,
} from "../../hooks/usePackagingData";
import CreatePackagingModal from "./CreatePackagingModal";
import UpdatePackagingModal from "./UpdatePackagingModal";
import { Space, Table, Button, Popconfirm } from "antd";
import useNotification from "../../hooks/useNotification";

const Packaging = () => {
  const openNotificationWithIcon = useNotification();

  const { data, isLoading } = usePackagingData();
  const { mutate } = useDeletePackagingData();

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
    mutate(id);

    openNotificationWithIcon(
      "success",
      "Packaging deletion",
      "Packaging deleted successfully!"
    );
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
