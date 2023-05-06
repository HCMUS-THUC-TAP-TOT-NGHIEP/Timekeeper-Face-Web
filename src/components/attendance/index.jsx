import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { StatisticPage } from "./StatisticPage";
const AttendanceManagementIndex = (props) => {
  useEffect(() => {
    document.title = "Quản lý chấm công";
  }, []);
  return <Outlet />;
};

export { AttendanceManagementIndex, StatisticPage };
