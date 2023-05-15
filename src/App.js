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
  EmployeePageIndex,
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
  StatisticPageV2,
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
            element={<AccountIndexPage notify={notify} loginRequired={true} />}
          >
            <Route
              path=""
              exact
              element={<AccountListPage notify={notify} loginRequired={true} />}
            />
          </Route>
          <Route
            path="employee"
            element={<EmployeePageIndex loginRequired={true} notify={notify} />}
          >
            <Route
              path=""
              element={<AllEmployeesPage notify={notify} loginRequired={true} />}
            />
            <Route
              path="add"
              element={<NewEmployeePage notify={notify} loginRequired={true} />}
            />
            <Route
              exact
              path="edit/:employeeId"
              element={<EditEmployeePage notify={notify} loginRequired={true} />}
            />
            <Route
              exact
              path=":employeeId"
              element={<EmployeeProfile notify={notify} loginRequired={true} />}
            />
          </Route>
          <Route
            path="/department"
            element={<DepartmentList notify={notify} loginRequired={true} />}
          />
          <Route
            path="/department/all"
            element={<DepartmentList notify={notify} loginRequired={true} />}
          />

          <Route
            path="shift"
            element={<ShiftManagementIndex notify={notify} loginRequired={true} />}
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
          <Route path="timesheet" element={<AttendanceManagementIndex loginRequired={true} />}>
            <Route
              path="timekeeper"
              element={<StatisticPage notify={notify} loginRequired={true} />}
            />
            <Route
              path="timekeeper_v2"
              element={<StatisticPageV2 notify={notify} loginRequired={true} />}
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
      <Layout className="site-layout" style={{}}>
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
