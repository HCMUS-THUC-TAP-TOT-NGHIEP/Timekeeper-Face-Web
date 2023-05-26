import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
const AttendanceManagementIndex = ({ loginRequired, notify, ...rest }) => {
  const userDetails = useAuthState();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Quản lý chấm công";
    if (loginRequired && !userDetails.token) {
      notify.warning({
        message: "Yêu cầu đăng nhập để xem chấm công.",
      });
      navigate("/login");
      return;
    }
  }, [loginRequired]);
  return <Outlet />;
};

export * from "./StatisticPage";
export * from "./StatisticPageV2";
export * from "./TimesheetSummaryTablePage";
export * from "./TimesheetDetailPage";
export * from "./TimesheetTablePage";
export { AttendanceManagementIndex };
