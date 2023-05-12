import { Layout, notification, theme } from "antd";
import React, { useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";
import { AccountIndexPage, AccountListPage } from "./components/account";
import { ChangePasswordPage } from "./components/authentication/ChangePassword";
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
import NoMatch from "./components/layout/NoMatch";
import MySidebar from "./components/layout/Sidebar";
import {
  EditShiftAssignmentPage,
  ShiftAssignmentDetail,
  ShiftAssignmentListPage,
  ShiftAssignmentPage,
  ShiftManagementIndex,
} from "./components/shift";
import { ShiftList } from "./components/shift/ShiftList";
import {
  AttendanceManagementIndex,
  StatisticPage,
} from "./components/attendance";
import { SummaryPage } from "./components/attendance/Summary";

function App() {
  const [notify, contextHolder] = notification.useNotification();
  return (
    <AuthProvider>
      {contextHolder}
      <Routes>
        <Route path="/" element={<CustomLayout />}>
          <Route path="/" element={<Dashboard requiredLogin={true} />} />
          <Route
            path="/dashboard"
            element={<Dashboard loginRequired={true} />}
          />
          <Route
            path="/manage/account"
            element={<AccountIndexPage loginRequired={true} />}
          >
            <Route
              path=""
              exact
              element={<AccountListPage loginRequired={true} />}
            />
          </Route>
          <Route
            path="/employee"
            element={<AllEmployeesPage loginRequired={true} />}
          />
          <Route
            path="/employee/all"
            element={<AllEmployeesPage loginRequired={true} />}
          />
          <Route
            path="/employee/add"
            element={<NewEmployeePage loginRequired={true} />}
          />
          <Route
            path="/employee/edit/:employeeId"
            element={<EditEmployeePage loginRequired={true} />}
          />
          <Route
            path="/employee/:employeeId"
            element={<EmployeeProfile loginRequired={true} />}
          />
          <Route
            path="/department"
            element={<DepartmentList loginRequired={true} />}
          />
          <Route
            path="/department/all"
            element={<DepartmentList loginRequired={true} />}
          />

          <Route
            path="shift"
            element={<ShiftManagementIndex loginRequired={true} />}
          >
            <Route
              path=""
              element={<ShiftList notify={notify} loginRequired={true} />}
            />
            <Route
              path="assignment"
              element={
                <ShiftAssignmentPage notify={notify} loginRequired={true} />
              }
            />
            <Route
              path="assignment/edit/:id"
              element={
                <EditShiftAssignmentPage notify={notify} loginRequired={true} />
              }
            />
            <Route
              path="assignment/list"
              element={
                <ShiftAssignmentListPage notify={notify} loginRequired={true} />
              }
            />
            <Route
              path="assignment/detail/:id"
              element={
                <ShiftAssignmentDetail notify={notify} loginRequired={true} />
              }
            />
          </Route>
          <Route path="attendance" element={<AttendanceManagementIndex />}>
            <Route
              path="statistic"
              element={<StatisticPage notify={notify} loginRequired={true} />}
            />
            <Route
              path="summary"
              element={<SummaryPage notify={notify} loginRequired={true} />}
            />
          </Route>
          <Route
            path="/profile/changepwd"
            exact
            element={
              <ChangePasswordPage notify={notify} loginRequired={true} />
            }
          />
        </Route>
        <Route
          path="/register"
          exact
          element={<RegisterPage notify={notify} />}
        />
        <Route path="/login" exact element={<LoginPage notify={notify} />} />
        <Route
          path="/forgotpwd"
          exact
          element={<ForgotPasswordPage notify={notify} />}
        />
        <Route
          path="/reset-password/:access_token"
          exact
          element={<ResetPasswordPage notify={notify} />}
        />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </AuthProvider>
  );
}

function CustomLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const [siderWidth, setSiderWidth] = useState(200);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <MySidebar
        width={siderWidth}
        setSiderWidth={setSiderWidth}
        collapsed={collapsed}
      />
      <Layout
        className="site-layout"
        style={{
          marginLeft: siderWidth,
        }}
      >
        <MyHeader
          siderWidth={siderWidth}
          setSiderWidth={setSiderWidth}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
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
