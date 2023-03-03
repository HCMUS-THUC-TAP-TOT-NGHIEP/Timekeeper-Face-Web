import { Layout, theme } from "antd";
import React, { useState } from "react";
import { Outlet, Route, Routes } from "react-router";
import ChangePasswordPage from "./components/authentication/ChangePassword";
import {
  ForgotPasswordPage,
  ResetPasswordPage,
} from "./components/authentication/ForgotPassword";
import LoginPage from "./components/authentication/Login";
import RegisterPage from "./components/authentication/Register";
import { Dashboard } from "./components/dashboard";
import { AllEmployeesPage, EmployeeProfile } from "./components/employee";
import MyFooter from "./components/layout/Footer";
import MyHeader from "./components/layout/Header";
import MySidebar from "./components/layout/Sidebar";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CustomLayout />}>
          <Route path="/" exact element={<Dashboard />} />
          <Route path="/dashboard" exact element={<Dashboard />} />
          <Route path="/employee" exact element={<AllEmployeesPage />} />
          <Route path="/employee/all" exact element={<AllEmployeesPage />} />
          <Route path="/employee/add" exact element={<AllEmployeesPage />} />
          <Route
            path="/employee/edit/:employeeId"
            exact
            element={<EmployeeProfile />}
          />
          <Route
            path="/employee/:employeeId"
            exact
            element={<EmployeeProfile />}
          />
        </Route>
        <Route path="/register" exact element={<RegisterPage />} />
        <Route path="/login" exact element={<LoginPage />} />
        <Route path="/forgotpwd" exact element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/:access_token"
          exact
          element={<ResetPasswordPage />}
        />
        <Route path="/changepwd" exact element={<ChangePasswordPage />} />
      </Routes>
    </>
  );
}

function CustomLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <MySidebar collapsed={collapsed} />
      <Layout className="site-layout">
        <MyHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout.Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Layout.Content>
        <MyFooter />
      </Layout>
    </Layout>
  );
}

export default App;
