import { Routes, Route } from "react-router-dom";
import { Layout } from "antd";
const { Content } = Layout;
import Sidebar from "./components/Sidebar/Sidebar";
import Category from "./pages/Category/Category";
import Product from "./pages/Product/Product";
import Packaging from "./pages/Packaging/Packaging";
import User from "./pages/User/User";
import Menu from "./pages/Menu/Menu";
import Expense from "./pages/Expense/Expense";

function App() {
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sidebar />
      <Layout>
        <Content
          style={{
            margin: "16px",
          }}
        >
          <Routes>
            <Route path="/" element={<Category />} />
            <Route path="/product" element={<Product />} />
            <Route path="/packaging" element={<Packaging />} />
            <Route path="/user" element={<User />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/expense" element={<Expense />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
