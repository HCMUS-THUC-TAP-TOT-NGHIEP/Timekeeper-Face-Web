import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  notification,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DeleteOneEmployee, GetManyEmployee } from "./api";
import "./style.css";

export const AllEmployeesPage = (props) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentEmployeeList, setCurrentEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [notify, contextHolder] = notification.useNotification();

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
          for (var ob of ResponseData) {
            ob.key = ob.Id;
          }
          setCurrentEmployeeList(ResponseData);
          setLoading(false);
          return;
        }
      })
      .catch((error) => {
        if (error.response) {
          notify.error({
            message: "Có lỗi ở response.",
            description: `[${error.response.statusText}]`,
          });
        } else if (error.request) {
          notify.error({
            message: "Có lỗi ở request.",
            description: error,
          });
        } else {
          notify.error({
            message: "Có lỗi ở máy khách",
            description: error.message,
          });
        }
      });
  }, [page, perPage]);

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
      sorter: (a, b) =>
        (a.FirstName + a.LastName).localeCompare(b.FirstName + b.LastName),
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
        DateOfBirth
          ? new Date(Date.parse(DateOfBirth)).toLocaleDateString()
          : "",
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
      title: "Chức vụ",
      dataIndex: "Position",
      key: "Position",
      width: 100,
      sorter: (a, b) => String(a.Position).localeCompare(String(b.Position)),
      filters: [],
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Phòng ban",
      dataIndex: "DepartmentId",
      key: "DepartmentId",
      width: 100,
      sorter: (a, b) =>
        String(a.DepartmentId).localeCompare(String(b.DepartmentId)),
      filters: [
        {
          text: "HR - Nhân sự",
          value: "HR - Nhân sự",
        },
        {
          text: "FTS - Phòng Lập trình",
          value: "FTS - Phòng Lập trình",
        },
        {
          text: "Marketing",
          value: "Marketing",
        },
      ],
      onFilter: (value, record) => record.DepartmentId.startsWith(value),
      filterSearch: true,
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
      render: (_, employee) => (
        <ActionMenu
          Employee={employee}
          currentEmployeeList={currentEmployeeList}
          setCurrentEmployeeList={setCurrentEmployeeList}
        />
      ),
      width: 20,
      fixed: "right",
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
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

function ActionMenu(props) {
  const { Employee, setCurrentEmployeeList, currentEmployeeList } = props;
  const [notify, contextHolder] = notification.useNotification();
  const deleteEmployee = () => {
    DeleteOneEmployee({ EmployeeId: Employee.Id })
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          notification.success({
            description: "Xóa nhân viên thành công",
          });
          setCurrentEmployeeList(
            currentEmployeeList.filter((a) => a.Id !== Employee.Id)
          );
          return;
        }
        notification.error({
          title: "Xóa nhân viên Không thành công",
          description: Description,
        });
      })
      .catch((error) => {
        if (error.response) {
          notify.error({
            message: "Có lỗi ở response.",
            description: `[${error.response.statusText}]`,
          });
        } else if (error.request) {
          notify.error({
            message: "Có lỗi ở request.",
            description: error,
          });
        } else {
          notify.error({
            message: "Có lỗi ở máy khách",
            description: error.message,
          });
        }
      });
  };
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
          description={`Bạn có chắc muốn xóa nhân viên ID ${Employee.Id} - ${Employee.FirstName} ${Employee.LastName}?`}
          okText="Yes"
          cancelText="No"
          placement="top"
          onConfirm={deleteEmployee}
        >
          <Space>
            <DeleteFilled key="1" />
            Xóa
          </Space>
        </Popconfirm>
      ),
      key: "1",
    },
  ];
  return (
    <>
      {contextHolder}
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
    </>
  );
}
