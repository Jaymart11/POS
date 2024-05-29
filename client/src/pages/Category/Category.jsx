import { useState } from "react";
import {
  useCategoryData,
  useDeleteCategoryData,
} from "../../hooks/useCategoryData";
import CreateCategoryModal from "./CreateCategoryModal";
import UpdateCategoryModal from "./UpdateCategoryModal";
import { Space, Table, Button, Popconfirm } from "antd";
import useNotification from "../../hooks/useNotification";
import { downloadReport } from "../../services/orderService";
const Category = () => {
  const openNotificationWithIcon = useNotification();

  const { data, isLoading } = useCategoryData();
  const { mutate } = useDeleteCategoryData();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showUpdateModal = (category) => {
    setCurrentCategory(category);
    setIsUpdateModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    setCurrentCategory(null);
  };

  const confirmDelete = (id) => {
    mutate(id);

    openNotificationWithIcon(
      "success",
      "Category deletion",
      "Category deleted successfully!"
    );
  };

  const columns = [
    {
      title: "Name",
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
            title="Delete the category"
            description="Are you sure to delete this category?"
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
      <CreateCategoryModal
        visible={isCreateModalVisible}
        onCancel={handleCancel}
      />
      <UpdateCategoryModal
        visible={isUpdateModalVisible}
        onCancel={handleCancel}
        category={currentCategory}
      />
      <Button
        style={{ marginBottom: "20px" }}
        type="primary"
        size="large"
        onClick={showCreateModal}
      >
        Create Category
      </Button>
      <Button onClick={downloadReport}>Test</Button>
      <Table columns={columns} dataSource={data} loading={isLoading} />
    </>
  );
};

export default Category;
