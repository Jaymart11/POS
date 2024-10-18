import { FloatButton } from "antd";
import { NotificationOutlined } from "@ant-design/icons";
import { useLowQuantityData } from "../../hooks/useSettingData";
import NotificationModal from "./NotificationModal";
import { useState } from "react";

function Notification({ isLogin }) {
  const { data, isLoading } = useLowQuantityData();
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => {
    setIsVisible(true);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <>
      <NotificationModal
        visible={isVisible}
        onCancel={handleCancel}
        data={data}
        isLoading={isLoading}
      />
      {isLogin && (
        <FloatButton
          shape="circle"
          type="primary"
          style={{ top: 20 }}
          badge={{ count: data?.length, status: "processing" }}
          icon={<NotificationOutlined style={{ color: "#1d1d1d" }} />}
          onClick={() => showModal()}
        />
      )}
    </>
  );
}

export default Notification;
