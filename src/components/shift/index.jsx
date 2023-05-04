import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ShiftAssignmentDetail } from "./ShiftAssignmentDetail";
import { ShiftAssignmentListPage } from "./ShiftAssignmentListPage";
import {
  EditShiftAssignmentPage,
  ShiftAssignmentPage,
} from "./ShiftAssignmentPage";

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

