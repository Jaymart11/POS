import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  usePackagingData,
  useUpdatePackagingOrderData,
} from "../../hooks/usePackagingData";
import { useUpdatePackagingData } from "../../hooks/usePackagingData";
import CreatePackagingModal from "./CreatePackagingModal";
import UpdatePackagingModal from "./UpdatePackagingModal";
import { Space, Table, Button, Popconfirm } from "antd";
import useNotification from "../../hooks/useNotification";
import { format } from "date-fns";
import RestockPackagingModal from "./RestockPackagingModal";
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

const Packaging = () => {
  const openNotificationWithIcon = useNotification();
  const user = JSON.parse(localStorage.getItem("user"));
  const { data, isLoading } = usePackagingData();
  const { mutate } = useUpdatePackagingData();
  const { mutate: orderMutate } = useUpdatePackagingOrderData();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isStockModalVisible, setIsStockModalVisible] = useState(false);
  const [currentPackaging, setCurrentPackaging] = useState(null);
  const [dataSource, setDataSource] = React.useState([]);

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showUpdateModal = (packaging) => {
    setCurrentPackaging(packaging);
    setIsUpdateModalVisible(true);
  };

  const showStockModal = (packaging) => {
    setCurrentPackaging(packaging);
    setIsStockModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    setIsStockModalVisible(false);
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
          <Button type="primary" onClick={() => showStockModal(record)}>
            Restock/Damaged
          </Button>
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

        orderMutate(updatedState);

        return updatedState;
      });
    }
  };

  useEffect(() => {
    setDataSource(data || []);
  }, [data]);

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

      <RestockPackagingModal
        visible={isStockModalVisible}
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
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSource?.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            rowKey="id"
            components={{
              body: {
                row: Row,
              },
            }}
            columns={columns}
            dataSource={dataSource}
            loading={isLoading}
            scroll={{ x: "max-content" }}
          />
        </SortableContext>
      </DndContext>
    </>
  );
};

export default Packaging;
