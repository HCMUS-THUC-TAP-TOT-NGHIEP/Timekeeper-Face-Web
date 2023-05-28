import { DeleteOutlined, EditTwoTone, EyeTwoTone } from "@ant-design/icons";
import { faArrowsRotate, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { ImportDataComponent } from "./ImportEmployeeList";
import { DeleteOneEmployee, GetManyEmployee } from "./api";
import "./style.css";

export const AllEmployeesPage = (props) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentEmployeeList, setCurrentEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notify, contextHolder] = notification.useNotification();
  const [total, setTotal] = useState(40);
  const [reload, setReload] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        var response = await GetManyEmployee({ page, perPage });
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
      } catch (error) {
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
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page, perPage, reload]);

  const deleteOneEmployee = (values) => {
    setCurrentEmployeeList(
      currentEmployeeList.filter((a) => a.Id !== values.Id)
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "Id",
      key: "Id",
      width: 50,
      fixed: "left",
      sorter: (a, b) => a.Id - b.Id,
    },
    {
      title: "Họ tên",
      dataIndex: "FullName",
      key: "FullName",
      fixed: "left",
      render: (_, employee) => `${employee.LastName} ${employee.FirstName}`,
      sorter: (a, b) =>
        compareString(a.FirstName + a.LastName, b.FirstName + b.LastName),
      width: 300,
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
      title: "Vị trí công việc",
      dataIndex: "Position",
      key: "Position",
      sorter: (a, b) => String(a.Position).localeCompare(String(b.Position)),
      filters: [],
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
      width: 300,
    },
    {
      title: "Phòng ban",
      dataIndex: "DepartmentName",
      key: "DepartmentName",
      sorter: (a, b) => compareString(a.DepartmentName, b.DepartmentName),
      onFilter: (value, record) => record.DepartmentId.startsWith(value),
      filterSearch: true,
      width: 300,
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
      width: 300,
    },
    {
      title: "",
      dataIndex: "Action",
      key: "Action",
      render: (_, employee) => (
        <ActionMenu Employee={employee} deleteOneEmployee={deleteOneEmployee} />
      ),
      width: 120,
      align: "middle",
      fixed: "right",
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
          <Space wrap>
            <Button
              type="primary"
              onClick={() => setReload(!reload)}
              icon={
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  style={{ paddingRight: "8px" }}
                  spin={loading}
                />
              }
              loading={loading}
              style={{
                backgroundColor: "#ec5504",
                border: "1px solid #ec5504",
              }}
            >
              Lấy lại dữ liệu
            </Button>
            <Button
              type="primary"
              icon={
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ paddingRight: "8px" }}
                />
              }
              onClick={() => navigate("/employee/add")}
            >
              Thêm nhân viên mới
            </Button>
            <ImportDataComponent notify={notify} />
          </Space>
        </Col>
      </Row>
      <Table
        bordered
        loading={loading}
        scroll={{
          x: 1500,
          y: 1200,
        }}
        dataSource={currentEmployeeList}
        columns={columns}
        rowKey="Id"
        pagination={{
          onChange: (page, pageSize) => {
            setPage(page);
            setPerPage(pageSize);
          },
          total: total,
          pageSizeOptions: [10, 15, 25, 50],
          showSizeChanger: true,
          showTotal: (total, range) => `Tổng số bản ghi: ${total}`,
          position: "",
        }}
      />
    </Space>
  );
};

function ActionMenu(props) {
  const { Employee, deleteOneEmployee } = props;
  const [notify, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  return (
    <Space size="small">
      <Tooltip title="Xem">
        <Button
          size="small"
          type="text"
          icon={<EyeTwoTone />}
          onClick={() => navigate(`/employee/${Employee.Id}`)}
        />
      </Tooltip>
      <Tooltip title="Sửa">
        <Button
          size="small"
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
        const { Status, Description } = response;
        if (Status === 1) {
          notification.success({
            description: `Đã xóa nhân viên ${employee.LastName} ${employee.FirstName} - ${employee.Id}`,
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
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            danger
          ></Button>
        </Tooltip>
      </Popconfirm>
    </>
  );
};

export const SimpleEmployeeLListPage = (props) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentEmployeeList, setCurrentEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notify, contextHolder] = notification.useNotification();
  const [total, setTotal] = useState(40);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        var response = await GetManyEmployee({ page, perPage });
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
      } catch (error) {
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
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page, perPage]);

  const deleteOneEmployee = (values) => {
    setCurrentEmployeeList(
      currentEmployeeList.filter((a) => a.Id !== values.Id)
    );
  };

  const columns = [
    {
      title: "Mã NV",
      dataIndex: "Id",
      key: "Id",
      width: 50,
      fixed: "left",
      sorter: (a, b) => a.Id > b.Id,
    },
    {
      key: "FullName",
      title: "Họ tên",
      fixed: "left",
      render: (_, employee) => `${employee.LastName} ${employee.FirstName}`,
      sorter: (a, b) =>
        compareString(a.FirstName + a.LastName, b.FirstName + b.LastName),
      width: 400,
    },
    {
      title: "Vị trí công việc",
      dataIndex: "Position",
      key: "Position",
      sorter: (a, b) => String(a.Position).localeCompare(String(b.Position)),
      filters: [],
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
      width: 400,
    },
    {
      title: "Phòng ban",
      dataIndex: "DepartmentName",
      key: "DepartmentName",
      sorter: (a, b) => compareString(a.DepartmentName, b.DepartmentName),
      width: 400,
    },
    {
      title: "Ngày vào",
      dataIndex: "JoinDate",
      key: "JoinDate",
      render: (_, { JoinDate }) =>
        JoinDate ? dayjs(JoinDate).format(Config.DateFormat) : "",
      sorter: (a, b) => compareDatetime(a, b),
      width: 400,
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
      width: 400,
    },
    {
      title: "",
      key: "Action",
      render: (_, employee) => (
        <ActionMenu Employee={employee} deleteOneEmployee={deleteOneEmployee} />
      ),
      width: 150,
      fixed: "right",
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
          <Space wrap>
            <Button
              type="primary"
              onClick={() => setPage(1)}
              icon={
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  style={{ paddingRight: "8px" }}
                  spin={loading}
                />
              }
              loading={loading}
              style={{
                backgroundColor: "#ec5504",
                border: "1px solid #ec5504",
              }}
            >
              Lấy lại dữ liệu
            </Button>
            <Button
              type="primary"
              icon={
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ paddingRight: "8px" }}
                />
              }
              onClick={() => navigate("/employee/add")}
            >
              Thêm nhân viên mới
            </Button>
            <ImportDataComponent notify={notify} />
          </Space>
        </Col>
      </Row>
      <Table
        bordered
        loading={loading}
        scroll={{
          x: 1000,
          y: 1200,
          scrollToFirstRowOnChange: true,
        }}
        dataSource={currentEmployeeList}
        columns={columns}
        rowKey="Id"
        pagination={{
          onChange: (page, pageSize) => {
            setPage(page);
            setPerPage(pageSize);
          },
          total: total,
          pageSizeOptions: [10, 15, 25, 50],
          showSizeChanger: true,
          showTotal: (total, range) => `Tổng số bản ghi: ${total}`,
        }}
      />
    </Space>
  );
};
