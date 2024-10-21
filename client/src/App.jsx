import { Routes, Route } from "react-router-dom";
import { Layout, FloatButton } from "antd";
const { Content } = Layout;
import Sidebar from "./components/Sidebar/Sidebar";
import Category from "./pages/Category/Category";
import Product from "./pages/Product/Product";
import Packaging from "./pages/Packaging/Packaging";
import User from "./pages/User/User";
import Menu from "./pages/Menu/Menu";
import Expense from "./pages/Expense/Expense";
import Stock from "./pages/Stock/Stock";
import Login from "./pages/Login/Login";
import Report from "./pages/Report/Report";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";
import Settings from "./pages/Settings/Settings";
import Notification from "./components/Notification/Notification";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("user"));
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      {location.pathname !== "/" && isLogin && (
        <Sidebar setIsLogin={setIsLogin} isAdmin={isAdmin} />
      )}
      <Layout>
        <Notification isLogin={isLogin} />
        <Content
          style={{
            margin: "16px",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Login setIsLogin={setIsLogin} setIsAdmin={setIsAdmin} />
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              }
            />
            <Route
              path="/category"
              element={
                <ProtectedRoute>
                  <Category />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product"
              element={
                <ProtectedRoute>
                  <Product />
                </ProtectedRoute>
              }
            />
            <Route
              path="/packaging"
              element={
                <ProtectedRoute>
                  <Packaging />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <User />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ordering"
              element={
                <ProtectedRoute>
                  <Menu />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expense"
              element={
                <ProtectedRoute>
                  <Expense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stock"
              element={
                <ProtectedRoute>
                  <Stock />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
