import { useState } from "react";
import { useUserData, useDeleteUserData } from "../../hooks/useUserData";
import CreateUserModal from "./CreateUserModal";
import UpdateUserModal from "./UpdateUserModal";
import { Space, Table, Button, Popconfirm, Typography } from "antd";
import useNotification from "../../hooks/useNotification";

const User = () => {
  const openNotificationWithIcon = useNotification();

  const { data, isLoading } = useUserData();
  const { mutate } = useDeleteUserData();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showUpdateModal = (user) => {
    setCurrentUser(user);
    console.log(user);
    setIsUpdateModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    setCurrentUser(null);
  };

  const confirmDelete = (id) => {
    mutate(id);

    openNotificationWithIcon(
      "success",
      "User deletion",
      "User deleted successfully!"
    );
  };

  const columns = [
    {
      title: "Name",
      render: (_, record) => (
        <Space size="middle">
          <Typography>
            {record.first_name} {record.last_name}
          </Typography>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Access Level",
      dataIndex: "name",
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
            title="Delete the user"
            description="Are you sure to delete this user?"
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
      <CreateUserModal visible={isCreateModalVisible} onCancel={handleCancel} />
      <UpdateUserModal
        visible={isUpdateModalVisible}
        onCancel={handleCancel}
        user={currentUser}
      />
      <Button
        style={{ marginBottom: "20px" }}
        type="primary"
        size="large"
        onClick={showCreateModal}
      >
        Create User
      </Button>
      <Table columns={columns} dataSource={data} loading={isLoading} />
    </>
  );
};

export default User;
