import { DeleteOutlined, EditTwoTone, EyeTwoTone } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
  notification,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { compareDatetime, compareString } from "../../utils/Comparation";
import { DeleteOneEmployee, GetManyEmployee } from "./api";
import "./style.css";

export const AllEmployeesPage = (props) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentEmployeeList, setCurrentEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notify, contextHolder] = notification.useNotification();
  const [total, setTotal] = useState(40);
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
          const { EmployeeList, Total } = ResponseData;
          setTotal(Total);
          setCurrentEmployeeList(EmployeeList);
          return;
        }
        notify.error({
          message: "Không thành công",
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, perPage]);

  const deleteOneEmployee = (values) => {
    setCurrentEmployeeList(
      currentEmployeeList.filter((a) => a.Id !== values.Id)
    );
  };

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
      title: "ID",
      dataIndex: "Id",
      key: "Id",
      width: 60,
      fixed: "left",
      sorter: (a, b) => a.Id - b.Id,
    },
    {
      title: "Họ tên",
      dataIndex: "FullName",
      key: "FullName",
      width: 200,
      fixed: "left",
      render: (_, employee) => `${employee.LastName} ${employee.FirstName}`,
      sorter: (a, b) =>
        compareString(a.FirstName + a.LastName, b.FirstName + b.LastName),
      // (a.FirstName + a.LastName).localeCompare(b.FirstName + b.LastName),
    },
    {
      title: "Ngày sinh",
      dataIndex: "DateOfBirth",
      key: "DateOfBirth",
      render: (_, { DateOfBirth }) =>
        DateOfBirth ? dayjs(DateOfBirth).format(Config.DateFormat) : "",
      width: 150,
    },
    {
      title: "Giới tính",
      dataIndex: "Gender",
      key: "Gender",
      render: (_, employee) => (employee.Gender ? "Nam" : "Nữ"),
      width: 80,
    },
    {
      title: "Chức vụ",
      dataIndex: "Position",
      key: "Position",
      width: 200,
      sorter: (a, b) => String(a.Position).localeCompare(String(b.Position)),
      filters: [],
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Phòng ban",
      dataIndex: "DepartmentName",
      key: "DepartmentName",
      width: 100,
      sorter: (a, b) => compareString(a.DepartmentName, b.DepartmentName),
      // String(a.DepartmentId).localeCompare(String(b.DepartmentId)),
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
        JoinDate ? dayjs(JoinDate).format(Config.DateFormat) : "",
      width: 150,
      sorter: (a, b) => compareDatetime(a, b),
    },
    {
      title: "Ngày nghỉ",
      dataIndex: "LeaveDate",
      key: "LeaveDate",
      render: (_, { LeaveDate }) =>
        LeaveDate ? dayjs(LeaveDate).format(Config.DateFormat) : "",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "Address",
      key: "Address",
      width: 200,
    },
    {
      title: "",
      dataIndex: "Action",
      key: "Action",
      render: (_, employee) => (
        <ActionMenu Employee={employee} deleteOneEmployee={deleteOneEmployee} />
      ),
      width: 150,
      // fixed: "right",
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
      <Row gutter={[16, 16]} wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Danh sách nhân viên
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/employee/all">Nhân viên</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button type="primary" onClick={() => navigate("/employee/add")}>
            Thêm nhân viên mới
          </Button>
        </Col>
      </Row>
      <Table
        bordered
        loading={loading}
        scroll={{
          x: 1500,
        }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        dataSource={currentEmployeeList}
        columns={columns}
        rowKey="Id"
        pagination={{
          onChange: (page, pageSize) => {
            setPage(page);
            setPerPage(pageSize);
          },
          hideOnSinglePage: true,
          total: total,
          pageSizeOptions: [10, 15, 25, 50],
          showSizeChanger: true,
        }}
      />
    </Space>
  );
};

// rowSelection object indicates the need for row selection

function ActionMenu(props) {
  const { Employee, deleteOneEmployee } = props;
  const [notify, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  return (
    <Space size="small">
      <Tooltip title="Xem">
        <Button
          type="text"
          icon={<EyeTwoTone />}
          onClick={() => navigate(`/employee/${Employee.Id}`)}
        />
      </Tooltip>
      <Tooltip title="Sửa">
        <Button
          type="text"
          icon={<EditTwoTone />}
          onClick={() => navigate(`/employee/edit/${Employee.Id}`)}
        />
      </Tooltip>
      <DeleteEmployee
        notify={notify}
        employee={Employee}
        deleteOneEmployee={deleteOneEmployee}
      />
      {contextHolder}
    </Space>
  );
}

const DeleteEmployee = (props) => {
  const { notify, employee, deleteOneEmployee } = props;
  const [loading, setLoading] = useState(false);
  const deleteEmployee = () => {
    setLoading(true);
    DeleteOneEmployee({ EmployeeId: employee.Id })
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          notification.success({
            description: "Xóa nhân viên thành công",
          });
          deleteOneEmployee(employee);
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
      })
      .finally(function () {
        setLoading(false);
      });
  };

  return (
    <>
      <Popconfirm
        title={`Xóa nhân viên ID ${employee.Id}`}
        description={`Bạn có chắc muốn xóa nhân viên ID ${employee.Id} - ${employee.LastName} ${employee.FirstName} ?`}
        onConfirm={deleteEmployee}
        okText="Xóa"
        okButtonProps={{ danger: true, loading: loading }}
        cancelText="Hủy"
        placement="topRight"
      >
        <Tooltip title="Xóa">
          <Button type="text" icon={<DeleteOutlined />} danger></Button>
        </Tooltip>
      </Popconfirm>
    </>
  );
};
