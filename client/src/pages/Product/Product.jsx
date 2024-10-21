import React, { useState, useEffect, useContext, useMemo } from "react";
import { useProductData } from "../../hooks/useProductData";
import {
  useDeleteProductData,
  useUpdateProductOrderData,
} from "../../hooks/useProductData";
import {
  useCategoryData,
  useUpdateCategoryOrderData,
} from "../../hooks/useCategoryData";
import CreateProductModal from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";
import RestockProductModal from "./RestockProductModal";
import { Space, Table, Button, Popconfirm } from "antd";
import useNotification from "../../hooks/useNotification";
import { format } from "date-fns";
import { MenuOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const RowContext = React.createContext({});
const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<MenuOutlined />}
      style={{
        cursor: "move",
      }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const Row = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 2,
        }
      : {}),
  };
  const contextValue = useMemo(
    () => ({
      setActivatorNodeRef,
      listeners,
    }),
    [setActivatorNodeRef, listeners]
  );
  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const RowContext2 = React.createContext({});
const DragHandle2 = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext2);
  return (
    <Button
      type="text"
      size="small"
      icon={<MenuOutlined />}
      style={{
        cursor: "move",
      }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const Row2 = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 2,
        }
      : {}),
  };
  const contextValue = useMemo(
    () => ({
      setActivatorNodeRef,
      listeners,
    }),
    [setActivatorNodeRef, listeners]
  );
  return (
    <RowContext2.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext2.Provider>
  );
};

const Product = () => {
  const openNotificationWithIcon = useNotification();
  const [currentCategory, setCurrentCategory] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const {
    data: productData,
    isLoading: productLoading,
    refetch,
  } = useProductData(currentCategory);
  const { data: categoryData, isLoading: categoryLoading } = useCategoryData();
  const { mutate } = useDeleteProductData();
  const { mutate: updateMutate } = useUpdateCategoryOrderData();
  const { mutate: productMutate } = useUpdateProductOrderData();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isRestockModalVisible, setIsRestockModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [dataSource, setDataSource] = React.useState([]);
  const [dataSource2, setDataSource2] = React.useState([]);

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showUpdateModal = (product) => {
    setCurrentProduct(product);
    setIsUpdateModalVisible(true);
  };

  const showRestockModal = (product) => {
    setCurrentProduct(product);
    setIsRestockModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    setIsRestockModalVisible(false);
    setCurrentProduct(null);
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
        "Product deletion",
        "Product deleted successfully!"
      );
    } catch (e) {
      openNotificationWithIcon(
        "error",
        "Product deletion",
        "Product deleted failed!"
      );
    }
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
    {
      key: "sort",
      align: "center",
      width: 100,
      render: () => <DragHandle2 />,
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
          <Button type="primary" onClick={() => showRestockModal(record)}>
            Restock/Damaged
          </Button>
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
    {
      key: "sort",
      align: "center",
      width: 100,
      render: () => <DragHandle />,
    },
  ];

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.id === active?.id
        );
        const overIndex = prevState.findIndex(
          (record) => record.id === over?.id
        );
        const updatedState = arrayMove(prevState, activeIndex, overIndex);
        updatedState.forEach((item, index) => {
          item.order_num = index + 1;
        });

        productMutate(updatedState);

        return updatedState;
      });
    }
  };

  const onDragEnd2 = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSource2((prevState, idx) => {
        console.log(idx);
        const activeIndex = prevState.findIndex(
          (record) => record.id === active?.id
        );
        const overIndex = prevState.findIndex(
          (record) => record.id === over?.id
        );
        const updatedState = arrayMove(prevState, activeIndex, overIndex);
        updatedState.forEach((item, index) => {
          item.order_num = index + 1;
        });

        updateMutate(updatedState);

        return updatedState;
      });
    }
  };

  useEffect(() => {
    setDataSource(productData || []);
    setDataSource2(categoryData || []);
  }, [productData, categoryData]);

  return (
    <div
      style={{
        height: "96.5vh",
        overflowX: "hidden",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
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
      <RestockProductModal
        visible={isRestockModalVisible}
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
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd2}>
        <SortableContext
          items={dataSource2?.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={{
              body: {
                row: Row2,
              },
            }}
            columns={columns}
            dataSource={dataSource2}
            loading={categoryLoading}
            scroll={{ x: "max-content" }}
            expandable={{
              expandedRowRender: () => (
                <DndContext
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={onDragEnd}
                >
                  <SortableContext
                    items={dataSource?.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Table
                      components={{
                        body: {
                          row: Row,
                        },
                      }}
                      columns={productColumns}
                      dataSource={dataSource}
                      loading={productLoading}
                      scroll={{ x: "max-content" }}
                      rowKey="id"
                    />
                  </SortableContext>
                </DndContext>
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
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Product;
