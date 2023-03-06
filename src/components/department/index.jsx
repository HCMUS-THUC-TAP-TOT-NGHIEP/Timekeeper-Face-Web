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
import { Link } from "react-router-dom";
import { GetDepartmentList } from "./api";

const AllDepartmentPage = (props) => {
  const [loading, setLoading] = useState(true);
  const [currentDepartmentList, setCurrentDepartmentList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  useEffect(() => {
    document.title = "Danh sách phòng ban";
    GetDepartmentList()
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          setCurrentDepartmentList(ResponseData);
          setLoading(false);
          return;
        }
      })
      .catch((error) => {});
  }, []);
  const columns = [
    {
      title: "Mã",
      dataIndex: "Id",
      key: "Id",
      width: 150,
      sorter: (a, b) => a.Id - b.Id,
    },
    {
      title: "Tên",
      dataIndex: "Name",
      key: "Name",
      width: 300,
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      title: "Trưởng phòng",
      dataIndex: "Manager",
      key: "Manager",
      render: (_, { ManagerId, ManagerName }) => ManagerId ? `${ManagerId} - ${ManagerName}` : "",
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_, department) => (
        <ActionMenu
          department={department}
          setDepartmentList={setCurrentDepartmentList}
          departmentList={currentDepartmentList}
        />
      ),
      width: 10,
    },
  ];
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/employee/all">Phòng ban</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/employee/all">Tất cả</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button type="primary">Thêm phòng ban mới</Button>
        </Col>
      </Row>
      <Skeleton loading={loading} active={loading}>
        <Table
          bordered
          scroll={{
            x: 900,
          }}
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={currentDepartmentList}
          columns={columns}
        />
      </Skeleton>
    </Space>
  );
};

function ActionMenu(props) {
  const { department, setDepartmentList, departmentList } = props;
  const deleteEmployee = () => {
    // DeleteOneEmployee({ EmployeeId: Employee.Id })
    //   .then((response) => {
    //     const { Status, Description, ResponseData } = response;
    //     if (Status === 1) {
    //       notification.success({
    //         description: "Xóa nhân viên thành công",
    //       });
    //       setCurrentEmployeeList(
    //         currentEmployeeList.filter((a) => a.Id !== Employee.Id)
    //       );
    //       return;
    //     }
    //     notification.error({
    //       title: "Xóa nhân viên thất bại",
    //       description: Description,
    //     });
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       notification.error({
    //         title: "Request có lỗi.",
    //         message: `Data: [${error.response.data}], Status [${error.response.status}]`,
    //       });
    //     } else if (error.request) {
    //       notification.error({
    //         title: "Response có lỗi.",
    //         message: error.response,
    //       });
    //     } else {
    //       notification.error({
    //         description: error.message,
    //       });
    //     }
    //   });
  };
  const items = [
    {
      label: (
        <Space>
          <EditFilled />
          Chỉnh sửa
        </Space>
      ),
      key: "0",
    },
    {
      label: (
        <Popconfirm
          title={`Xóa phòng ban ID ${department.Id}`}
          description={`Bạn có chắc muốn xóa nhân viên ID ${department.Id} - ${department.Name}?`}
          okText="Yes"
          cancelText="No"
          placement="top"
          onConfirm={deleteEmployee}
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
    <>
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

export { AllDepartmentPage };
