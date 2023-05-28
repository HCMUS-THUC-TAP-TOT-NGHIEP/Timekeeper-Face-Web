import { DeleteOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
  notification
} from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddDepartmentFrom } from "./AddComponent";
import { EditDepartmentForm } from "./EditComponent";
import {
  DeleteOneDepartment,
  GetDepartmentList
} from "./api";

const DepartmentList = (props) => {
  const { notify } = props;
  const [loading, setLoading] = useState(true);
  const [currentDepartmentList, setCurrentDepartmentList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  useEffect(() => {
    setLoading(true);
    GetDepartmentList({ Page: page, PerPage: perPage })
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          const { DepartmentList, Total } = ResponseData;
          setTotal(Total);
          setCurrentDepartmentList(DepartmentList);
          return;
        }
        notification.error({
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
  }, [perPage, page]);

  const updateOneDepartment = (values) => {
    const newCurrentDepartmentList = currentDepartmentList.map((department) => {
      if (department.Id === values.Id) {
        return values;
      } else {
        return department;
      }
    });
    setCurrentDepartmentList(newCurrentDepartmentList);
    return;
  };
  const insertOneDepartment = (values) => {
    setCurrentDepartmentList([...currentDepartmentList, values]);
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "Id",
      key: "Id",
      width: 80,
      sorter: (a, b) => a.Id - b.Id,
      fixed: "left",
    },
    {
      title: "Tên",
      dataIndex: "Name",
      key: "Name",
      width: 200,
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      title: "Trưởng phòng",
      dataIndex: "Manager",
      key: "Manager",
      render: (_, { ManagerId, ManagerName }) => ManagerName,
      with: 200,
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
          updateOneDepartment={updateOneDepartment}
        />
      ),
      width: 120,
      fixed: "right",
    },
  ];
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false} align="middle" gutter={[16, 16]}>
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Danh sách phòng ban
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/department/all">Phòng ban</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space wrap>
            <AddDepartmentFrom
              form={form}
              listState={[insertOneDepartment, currentDepartmentList]}
            />
          </Space>
        </Col>
      </Row>
      <Table
        loading={loading}
        bordered
        rowKey="Id"
        scroll={{
          x: 900,
        }}
        dataSource={currentDepartmentList}
        columns={columns}
        pagination={{
          pageSize: perPage,
          current: page,
          pageSizeOptions: [10, 20, 50],
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPage(page);
            setPerPage(pageSize);
          },
          showTotal: (total) => "Tổng " + total + " bản ghi.",
        }}
      />
    </Space>
  );
};

function ActionMenu(props) {
  const [form] = Form.useForm();
  const { department, setDepartmentList, departmentList, updateOneDepartment } =
    props;
  const [notify, contextHolder] = notification.useNotification();

  const deleteDepartment = () => {
    DeleteOneDepartment({ Id: department.Id })
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          notify.success({
            description: `Đã xóa phòng ban ${department.Id} - ${department.Name}`,
          });
          setDepartmentList(
            departmentList.filter((a) => a.Id !== department.Id)
          );
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
      });
  };

  return (
    <Space wrap size="small">
        <EditDepartmentForm
          form={form}
          content={department}
          listState={[updateOneDepartment, departmentList]}
        />
      <Popconfirm
        title={`Xóa phòng ban ID ${department.Id}`}
        description={`Bạn có chắc muốn xóa nhân viên ID ${department.Id} - ${department.Name}?`}
        okText="Yes"
        okType="danger"
        cancelText="No"
        placement="top"
        onConfirm={deleteDepartment}
      >
        <Tooltip title="Xoá" placement="bottom">
          <Button size="small" icon={<DeleteOutlined />} danger type="text" shape="circle" />
        </Tooltip>
      </Popconfirm>

      {contextHolder}
    </Space>
  );
}


export { DepartmentList };

