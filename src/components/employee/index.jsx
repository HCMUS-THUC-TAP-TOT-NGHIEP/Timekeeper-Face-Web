import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Menu,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  MoreOutlined,
} from "@ant-design/icons";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export const AllEmployeesPage = (props) => {
  useEffect(() => {
    document.title = "Tất cả nhân viên";
  }, []);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/employee/all">Nhân viên</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/employee/all">Tất cả</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button type="primary">Thêm nhân viên mới</Button>
        </Col>
      </Row>
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        dataSource={dataSource}
        columns={columns}
      />
      ;
    </Space>
  );
};

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
};
const dataSource = [
  {
    Id: 1,
    FirstName: "Khanh",
    LastName: "Nguyễn",
    DateOfBirth: new Date(2001, 10, 11),
    Gender: true,
    Address: "494 Lê Quang Định, phường 11, quận Bình Thạnh, TP. HCM",
    JoinDate: new Date(2023, 1, 1),
    LeaveDate: null,
    DepartmentId: null,
  },
];

const columns = [
  {
    title: "Họ tên",
    dataIndex: "FullName",
    key: "FullName",
    render: (_, employee) => `${employee.FirstName} ${employee.LastName}`,
  },
  {
    title: "ID",
    dataIndex: "Id",
    key: "Id",
  },
  {
    title: "Ngày sinh",
    dataIndex: "DateOfBirth",
    key: "DateOfBirth",
    render: (_, { DateOfBirth }) =>
      DateOfBirth
        ? `${DateOfBirth.getDate()} - ${DateOfBirth.getMonth()} - ${DateOfBirth.getFullYear()}`
        : "-",
  },
  {
    title: "Giới tính",
    dataIndex: "Gender",
    key: "Gender",
    render: (_, employee) => (employee.Gender ? "Nam" : "Nữ"),
  },
  {
    title: "Phòng ban",
    dataIndex: "DepartmentId",
    key: "DepartmentId",
    rende: (_, { DepartmentId }) => (DepartmentId ? DepartmentId : "-"),
  },
  {
    title: "Ngày vào",
    dataIndex: "JoinDate",
    key: "JoinDate",
    render: (_, { JoinDate }) =>
      `${JoinDate.getDate()} - ${JoinDate.getMonth()} - ${JoinDate.getFullYear()}`,
  },
  {
    title: "Ngày nghỉ",
    dataIndex: "LeaveDate",
    key: "LeaveDate",
    render: (_, { LeaveDate }) =>
      LeaveDate
        ? `${LeaveDate.getDate()} - ${LeaveDate.getMonth()} - ${LeaveDate.getFullYear()}`
        : "-",
  },
  {
    title: "",
    dataIndex: "Action",
    key: "Action",
    render: (_, employee) => <ActionMenu EmployeeId={employee.Id} />,
  },
];

function ActionMenu(props) {
  const { EmployeeId } = props;
  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Space>
        <MoreOutlined />
      </Space>
    </Dropdown>
  );
}

const items = [
  {
    label: (
      <Link to="">
        <Space>
          <EyeFilled />
          Xem
        </Space>
      </Link>
    ),
    key: "3",
  },
  {
    label: (
      <Link to="">
        <Space>
          <EditFilled />
          Chỉnh sửa
        </Space>
      </Link>
    ),
    key: "0",
  },
  {
    label: (
      <Link to="">
        <Space>
          <DeleteFilled />
          Xóa
        </Space>
      </Link>
    ),
    key: "1",
  },
];
