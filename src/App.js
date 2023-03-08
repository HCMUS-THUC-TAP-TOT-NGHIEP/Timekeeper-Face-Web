import { Layout } from "antd";
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
import { DepartmentList } from "./components/department";
import {
  AllEmployeesPage,
  EditEmployeePage,
  EmployeeProfile,
  NewEmployeePage,
} from "./components/employee";
import MyFooter from "./components/layout/Footer";
import MyHeader from "./components/layout/Header";
import MySidebar from "./components/layout/Sidebar";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CustomLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee" element={<AllEmployeesPage />} />
          <Route path="/employee/all" element={<AllEmployeesPage />} />
          <Route path="/employee/add" element={<NewEmployeePage />} />
          <Route
            path="/employee/edit/:employeeId"
            element={<EditEmployeePage />}
          />
          <Route path="/employee/:employeeId" element={<EmployeeProfile />} />
          <Route path="/department" element={<DepartmentList />} />
          <Route path="/department/all" element={<DepartmentList />} />
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
            // background: colorBgContainer,
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
