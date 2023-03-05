import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Menu,
  Popconfirm,
  Row,
  Skeleton,
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
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { GetManyEmployee } from "./api";

export const AllEmployeesPage = (props) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentEmployeeList, setCurrentEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Tất cả nhân viên";
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      navigate("/login");
      return;
    }
  }, []);

  useEffect(() => {
    GetManyEmployee({ page, perPage })
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          setCurrentEmployeeList(ResponseData);
          setLoading(false);
          return;
        }
      })
      .catch((error) => {});
  }, [page, perPage]);

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
          <Button type="primary" onClick={() => navigate("/employee/add")}>
            Thêm nhân viên mới
          </Button>
        </Col>
      </Row>
      <Skeleton loading={loading} active={loading}>
        <Table
          scroll={{
            x: 1500,
          }}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          dataSource={currentEmployeeList}
          columns={columns}
        />
      </Skeleton>
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

const columns = [
  {
    title: "Họ tên",
    dataIndex: "FullName",
    key: "FullName",
    width: 80,
    fixed: "left",
    render: (_, employee) => `${employee.FirstName} ${employee.LastName}`,
    sorter: (a, b) => (a.FirstName + a.LastName).localeCompare(b.FirstName + b.LastName),
  },
  {
    title: "ID",
    dataIndex: "Id",
    key: "Id",
    width: 40,
    fixed: "left",
    sorter: (a, b) => a.Id - b.Id,
  },
  {
    title: "Ngày sinh",
    dataIndex: "DateOfBirth",
    key: "DateOfBirth",
    render: (_, { DateOfBirth }) =>
      DateOfBirth ? new Date(Date.parse(DateOfBirth)).toLocaleDateString() : "",
    width: 60,
  },
  {
    title: "Giới tính",
    dataIndex: "Gender",
    key: "Gender",
    render: (_, employee) => (employee.Gender ? "Nam" : "Nữ"),
    width: 40,
  },
  {
    title: "Phòng ban",
    dataIndex: "DepartmentId",
    key: "DepartmentId",
    render: (_, { DepartmentId }) => (DepartmentId ? DepartmentId : "-"),
    width: 100,
    sorter: (a, b) =>
      String(a.DepartmentId).localeCompare(String(b.DepartmentId)),
  },
  {
    title: "Ngày vào",
    dataIndex: "JoinDate",
    key: "JoinDate",
    render: (_, { JoinDate }) =>
      JoinDate ? new Date(Date.parse(JoinDate)).toLocaleDateString() : "",
    width: 60,
    sorter: (a, b) => Date.parse(a.JoinDate) - Date.parse(b.JoinDate),
  },
  {
    title: "Địa chỉ",
    dataIndex: "Address",
    key: "Address",
    width: 120,
  },
  {
    title: "Ngày nghỉ",
    dataIndex: "LeaveDate",
    key: "LeaveDate",
    render: (_, { LeaveDate }) =>
      LeaveDate ? new Date(Date.parse(LeaveDate)).toLocaleDateString() : "",
    width: 60,
  },
  {
    title: "",
    dataIndex: "Action",
    key: "Action",
    render: (_, employee) => <ActionMenu Employee={employee} />,
    width: 20,
    fixed: "right",
  },
];

function ActionMenu(props) {
  const { Employee } = props;
  const items = [
    {
      label: (
        <Link to={`/employee/${Employee.Id}`}>
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
        <Link to={`/employee/edit/${Employee.Id}`}>
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
        <Popconfirm
          title={`Xóa nhân viên ID ${Employee.Id}`}
          description={`Bạn có chắc muốn xóa nhân viên ID ${Employee.Id}`}
          okText="Yes"
          cancelText="No"
          placement="top"
        >
          <a href="#" style={{ display: "block" }}>
            <Space>
              <DeleteFilled key="1" />
              Xóa
            </Space>
          </a>
        </Popconfirm>
      ),
      key: "1",
    },
  ];
  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
      arrow
    >
      <Space>
        <MoreOutlined />
      </Space>
    </Dropdown>
  );
}
