import { useState, useEffect } from "react";
import {
  useProductData,
  useDeleteProductData,
} from "../../hooks/useProductData";
import { useCategoryData } from "../../hooks/useCategoryData";

import CreateProductModal from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";
import { Space, Table, Button, Popconfirm } from "antd";
import useNotification from "../../hooks/useNotification";

const Product = () => {
  const openNotificationWithIcon = useNotification();
  const [currentCategory, setCurrentCategory] = useState(null);

  const {
    data: productData,
    isLoading: productLoading,
    refetch,
  } = useProductData(currentCategory);
  const { data: categoryData, isLoading: categoryLoading } = useCategoryData();
  const { mutate } = useDeleteProductData();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showUpdateModal = (product) => {
    setCurrentProduct(product);
    setIsUpdateModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    setCurrentProduct(null);
  };

  const confirmDelete = (id) => {
    mutate(id);
    openNotificationWithIcon(
      "success",
      "Product deletion",
      "Product deleted successfully!"
    );
  };

  useEffect(() => {
    if (currentCategory !== null) {
      refetch();
    }
  }, [currentCategory, refetch]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  const productColumns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Quantity",
      dataIndex: "product_quantity",
      key: "product_quantity",
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
            title="Delete the product"
            description="Are you sure to delete this product?"
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
      <CreateProductModal
        visible={isCreateModalVisible}
        onCancel={handleCancel}
        setCurrentCategory={setCurrentCategory}
      />
      <UpdateProductModal
        visible={isUpdateModalVisible}
        onCancel={handleCancel}
        setCurrentCategory={setCurrentCategory}
        product={currentProduct}
      />
      <Button
        style={{ marginBottom: "20px" }}
        type="primary"
        size="large"
        onClick={showCreateModal}
      >
        Create Product
      </Button>
      <Table
        columns={columns}
        dataSource={categoryData}
        loading={categoryLoading}
        expandable={{
          expandedRowRender: () => (
            <Table
              columns={productColumns}
              dataSource={productData}
              loading={productLoading}
              rowKey="id"
            />
          ),
          onExpand: (expanded, record) => {
            if (expanded) {
              setCurrentCategory(record.id);
            } else {
              setCurrentCategory(null);
            }
          },
          expandedRowKeys: [currentCategory],
          expandRowByClick: true,
        }}
        rowKey="id"
      />
    </>
  );
};

export default Product;
