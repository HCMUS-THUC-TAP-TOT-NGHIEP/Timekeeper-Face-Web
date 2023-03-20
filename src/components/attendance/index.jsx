import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  ShiftAssignmentPage,
  EditShiftAssignmentPage,
} from "./ShiftAssignmentPage";
import { ShiftAssignmentListPage } from "./ShiftAssignmentListPage";
import { ShiftAssignmentDetail } from "./ShiftAssignmentDetail";

const ShiftManagementIndex = (props) => {
  useEffect(() => {
    document.title = "Quản lý ca làm việc";
  }, []);
  return <Outlet />;
};

export {
  ShiftManagementIndex,
  ShiftAssignmentPage,
  ShiftAssignmentListPage,
  ShiftAssignmentDetail,
  EditShiftAssignmentPage,
};
