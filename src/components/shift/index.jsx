import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";

const ShiftManagementIndex = ({ loginRequired, notify, ...rest }) => {
  const userDetails = useAuthState();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Quản lý ca làm việc";
    if (loginRequired && !userDetails.token) {
      notify.warning({
        message: "Yêu cầu đăng nhập để tiếp tục.",
      });
      navigate("/login");
      return;
    }
  }, [loginRequired]);
  return <Outlet />;
};

export * from "./AddShift";
export * from "./ShiftAssignmentListPage";
export * from "./ShiftAssignmentPage";
export * from "./ShiftDetailPage";
export * from "./AddShiftAssignment";
export { ShiftManagementIndex };

