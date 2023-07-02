import dayjs from "dayjs";
import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthDispatch, useAuthState } from "../../Contexts/AuthContext";
import Config from "../../constant";
import { compareDatetime, compareString } from "../../utils/Comparation";
import "./style.css";
import { CheckAuthorization } from "../account/api";
import { handleErrorOfRequest } from "../../utils/Helpers";

const EmployeePageIndex = ({ notify, loginRequired, ...rest }) => {
  const userDetails = useAuthState();
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Danh mục nhân viên";
    if (loginRequired && !userDetails.token) {
      notify.warning({
        message: "Yêu cầu đăng nhập để tiếp tục.",
      });
      navigate("/login");
      return;
    }
    checkAuthorization();
  }, []);
  async function checkAuthorization() {
    try {
      var response = await CheckAuthorization({
        MenuName: "Employee",
        Permissions: [],
      });
      if (response.Status === 1) {
        let { Authorization } = response.ResponseData;
        console.log("User authorization", Authorization);
        dispatch({
          type: "CHECK_AUTHORIZATION",
          payload: {
            current: userDetails,
            permission: Authorization,
          },
        });
        return;
      }
      throw new Error(response.Description);
    } catch (error) {
      handleErrorOfRequest(error, notify);
    } finally {
    }
  }
  return <Outlet />;
};

export let defaultColumns = [
  {
    title: "Stt",
    align: "right",
    render: (_, record, index) => index + 1,
    fixed: "left",
    width: 60,
  },
  {
    title: "Mã NV",
    dataIndex: "Id",
    key: "Id",
    width: 100,
    fixed: "left",
    sorter: (a, b) => a.Id - b.Id,
    align: "right",
  },
  {
    title: "Họ tên",
    dataIndex: "FullName",
    key: "FullName",
    fixed: "left",
    render: (_, employee) => (
      <NavLink to={`/employee/${employee.Id}`}>
        {`${employee.LastName} ${employee.FirstName}`}
      </NavLink>
    ),
    sorter: (a, b) =>
      compareString(a.FirstName + a.LastName, b.FirstName + b.LastName),
    width: 200,
  },
  {
    title: "Ngày sinh",
    dataIndex: "DateOfBirth",
    key: "DateOfBirth",
    render: (_, { DateOfBirth }) =>
      DateOfBirth ? dayjs(DateOfBirth).format(Config.DateFormat) : "",
    align: "center",
    width: 150,
  },
  {
    title: "Giới tính",
    dataIndex: "Gender",
    key: "Gender",
    render: (_, employee) => (employee.Gender ? "Nam" : "Nữ"),
    align: "center",
    width: 100,
  },
  {
    title: "Vị trí công việc",
    dataIndex: "Position",
    key: "Position",
    sorter: (a, b) => String(a.Position).localeCompare(String(b.Position)),
    width: 200,
  },
  {
    title: "Phòng ban",
    dataIndex: "DepartmentName",
    key: "DepartmentName",
    sorter: (a, b) => compareString(a.DepartmentName, b.DepartmentName),
    onFilter: (value, record) => record.DepartmentId.startsWith(value),
    width: 220,
  },
  {
    title: "Ngày vào",
    dataIndex: "JoinDate",
    key: "JoinDate",
    render: (_, { JoinDate }) =>
      JoinDate ? dayjs(JoinDate).format(Config.DateFormat) : "",
    sorter: (a, b) => compareDatetime(a, b),
    align: "center",
    width: 150,
  },
  {
    title: "Ngày nghỉ",
    dataIndex: "LeaveDate",
    key: "LeaveDate",
    render: (_, { LeaveDate }) =>
      LeaveDate ? dayjs(LeaveDate).format(Config.DateFormat) : "",
    align: "center",
    width: 150,
  },
  {
    title: "Địa chỉ",
    dataIndex: "Address",
    key: "Address",
    width: 400,
  },
];

export { EmployeePageIndex };
export * from "./AllEmployeePage";
export * from "./EditEmployeePage";
export * from "./EmployeeProfile";
export * from "./NewEmployeePage";
