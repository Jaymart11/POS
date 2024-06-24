import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ProductOutlined,
  ShoppingCartOutlined,
  PieChartOutlined,
  ShoppingOutlined,
  UserOutlined,
  DatabaseOutlined,
  BorderOuterOutlined,
  LogoutOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
const { Sider } = Layout;
function getItem(label, key, icon, style) {
  return {
    key,
    icon,
    label,
    style,
  };
}

const Sidebar = ({ setIsLogin, isAdmin }) => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  const items =
    user.access_level === 1 || isAdmin
      ? [
          // getItem("Dashboard", "dashboard", <PieChartOutlined />),
          getItem("Report", "report", <PieChartOutlined />),
          getItem("Stock Adjustment", "stock", <BorderOuterOutlined />),
          getItem("Product", "product", <ProductOutlined />),
          getItem("Packaging", "packaging", <ShoppingOutlined />),
          getItem("Ordering", "ordering", <ShoppingCartOutlined />),
          getItem("Expense", "expense", <WalletOutlined />),
          getItem("Category", "category", <DatabaseOutlined />),
          getItem("User", "user", <UserOutlined />),

          getItem("Logout", "logout", <LogoutOutlined />, {
            position: "absolute",
            bottom: 50,
            width: "100%",
          }),
        ]
      : [
          getItem("Ordering", "ordering", <ShoppingCartOutlined />),
          getItem("Stock Adjustment", "stock", <BorderOuterOutlined />),
          getItem("Expense", "expense", <WalletOutlined />),
          getItem("Report", "report", <PieChartOutlined />),
          getItem("Logout", "logout", <LogoutOutlined />, {
            position: "absolute",
            bottom: 50,
            width: "100%",
          }),
        ];

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      localStorage.clear();
      setIsLogin(false);
      navigate("/");
    } else {
      const selectedItem = items.find((item) => item.key === e.key);
      if (selectedItem && selectedItem.key) {
        navigate(selectedItem.key); // Navigate to the corresponding path
      }
    }
  };
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Menu
        theme="dark"
        defaultSelectedKeys={[location.pathname.slice(1)]}
        mode="inline"
        items={items}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
