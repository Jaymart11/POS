import { notification } from "antd";
import { useCallback } from "react";

const useNotification = () => {
  const openNotificationWithIcon = useCallback((type, message, description) => {
    notification[type]({
      message,
      description,
    });
  }, []);

  return openNotificationWithIcon;
};

export default useNotification;
