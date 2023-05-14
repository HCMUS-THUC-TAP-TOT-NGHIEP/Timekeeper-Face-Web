import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ShiftAssignmentDetail } from "./ShiftAssignmentDetail";
import { ShiftAssignmentListPage } from "./ShiftAssignmentListPage";
import {
  EditShiftAssignmentPage,
  ShiftAssignmentPage,
} from "./ShiftAssignmentPage";
import { useAuthState } from "../../Contexts/AuthContext";

const ShiftManagementIndex = ({ loginRequired, notify, ...rest }) => {
  const userDetails = useAuthState();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Quản lý ca làm việc";
    if (loginRequired && !userDetails.token) {
      notify.warning({
        message: "Yêu cầu đăng nhập để đổi mật khẩu.",
      });
      navigate("/login");
      return;
    }
  }, [loginRequired]);
  return <Outlet />;
};

export {
  ShiftManagementIndex,
  ShiftAssignmentPage,
  ShiftAssignmentListPage,
  ShiftAssignmentDetail,
  EditShiftAssignmentPage,
};
