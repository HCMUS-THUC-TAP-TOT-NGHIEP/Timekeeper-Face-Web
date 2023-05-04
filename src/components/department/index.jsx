import {
  CloseOutlined,
  DeleteFilled,
  EditFilled,
  EditTwoTone,
  InfoCircleTwoTone,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Typography,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetManyEmployee } from "../employee/api";
import {
  CreateOneDepartment,
  DeleteOneDepartment,
  GetDepartmentList,
  UpdateOneDepartment,
} from "./api";

const DepartmentList = (props) => {
  const { notify } = props;
  const [loading, setLoading] = useState(true);
  const [currentDepartmentList, setCurrentDepartmentList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [form] = Form.useForm();
  useEffect(() => {
    document.title = "Danh sách phòng ban";
  }, []);
  useEffect(() => {
    GetDepartmentList()
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          for (var ob of ResponseData) {
            ob.key = ob.Id;
          }
          setCurrentDepartmentList(ResponseData);
          setLoading(false);
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
  const showCreateForm = () => {
    Modal.confirm({
      title: "Thêm phòng ban",
      icon: <InfoCircleTwoTone />,
      closeIcon: <CloseOutlined />,
      content: (
        <AddDepartmentFrom
          form={form}
          listState={[insertOneDepartment, currentDepartmentList]}
        />
      ),
      cancelText: "Hủy",
      okText: "Tạo mới",
      onOk() {
        form.submit();
      },
    });
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "Id",
      key: "Id",
      width: 150,
      sorter: (a, b) => a.Id - b.Id,
      fixed: "left",
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
      render: (_, { ManagerId, ManagerName }) =>
        ManagerId ? `${ManagerId} - ${ManagerName}` : "",
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
      width: 50,
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
            <Button type="primary" onClick={showCreateForm}>
              Thêm phòng ban mới
            </Button>
          </Space>
        </Col>
      </Row>
      <Table
        loading={loading}
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

  const showEditForm = () => {
    Modal.confirm({
      title: "Chỉnh sửa phòng ban",
      icon: <EditTwoTone />,
      closeIcon: <CloseOutlined />,
      content: (
        <EditDepartmentFrom
          form={form}
          content={department}
          listState={[updateOneDepartment, departmentList]}
        />
      ),
      cancelText: "Hủy",
      okText: "Cập nhật",
      onOk() {
        form.submit();
      },
    });
  };

  const items = [
    {
      label: (
        <Space onClick={showEditForm}>
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
          okType="danger"
          cancelText="No"
          placement="top"
          onConfirm={deleteDepartment}
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
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        placement="bottomRight"
        arrow
      >
        <MoreOutlined />
      </Dropdown>
      {contextHolder}
    </>
  );
}

const EditDepartmentFrom = function (props) {
  const form = props.form;
  const department = props.content;
  const [updateOneDepartment, departmentList] = props.listState;
  const [currentEmployeeList, setCurrentEmployeeList] = useState([]);
  const [notify, contextHolder] = notification.useNotification();

  useEffect(() => {
    form.setFieldsValue({
      Id: department.Id,
      Name: department.Name,
      Status: department.Status,
      ManagerId: department.ManagerId,
    });
    GetManyEmployee()
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          setCurrentEmployeeList(ResponseData);
          form.setFieldsValue({ ManagerId: department.ManagerId });
          return;
        }
        notify.error({
          message: "Có lỗi",
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
      .finally(() => {});
  }, [department]);
  const onSubmit = (values) => {
    UpdateOneDepartment(values)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          notification.success({
            description: "Chỉnh sửa thành công",
          });
          var manager = currentEmployeeList.find(
            (employee) => employee.Id === values.ManagerId
          );
          values.ManagerName = `${manager.FirstName} ${manager.LastName}`;
          updateOneDepartment(values);
          return;
        }
        notification.error({
          message: "Có lỗi",
          description:
            "Truy vấn danh sách nhân viên không thành công. " + Description,
        });
      })
      .catch((error) => {
        if (error.response) {
          notification.error({
            message: "Có lỗi ở response.",
            description: `[${error.response.statusText}]`,
          });
        } else if (error.request) {
          notification.error({
            message: "Có lỗi ở request.",
            description: error,
          });
        } else {
          notification.error({
            message: "Có lỗi ở máy khách",
            description: error.message,
          });
        }
      });
  };
  return (
    <Form
      form={form}
      name="basic"
      labelCol={{
        span: 8,
      }}
      onFinish={onSubmit}
      autoComplete="off"
      layout="vertical"
    >
      {contextHolder}
      <Form.Item
        hasFeedback
        labelCol={24}
        label="Mã Phòng Ban"
        name="Id"
        rules={[
          {
            required: true,
            message: "Mã Phòng Ban là trường bắt buộc.",
          },
        ]}
      >
        <Input readOnly />
      </Form.Item>
      <Form.Item
        hasFeedback
        labelCol={24}
        label="Tên"
        name="Name"
        rules={[
          {
            required: true,
            message: "Tên là trường bắt buộc.",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        hasFeedback
        labelCol={24}
        label="Trưởng phòng"
        name="ManagerId"
        rules={[
          {
            required: true,
            message: "Trưởng phòng là trường bắt buộc.",
          },
        ]}
      >
        <Select>
          {currentEmployeeList.map((employee, index) => (
            <Select.Option
              key={index}
              value={employee.Id}
            >{`${employee.FirstName} ${employee.LastName}`}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        hasFeedback
        labelCol={24}
        label="Trạng thái"
        name="Status"
        rules={[
          {
            required: true,
            message: "Trạng thái là trường bắt buộc.",
          },
        ]}
      >
        <Select>
          <Select.Option value="1">Hoạt động</Select.Option>
          <Select.Option value="0">Không hoạt động</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

const AddDepartmentFrom = function (props) {
  const form = props.form;
  const [currentEmployeeList, setCurrentEmployeeList] = useState([]);
  const [insertOneDepartment, departmentList] = props.listState;
  const [notify, contextHolder] = notification.useNotification();
  const onSubmit = (values) => {
    CreateOneDepartment(values)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          notification.success({
            description: "Thêm phòng ban thành công.",
          });
          values.Id = ResponseData.Id;
          var manager = currentEmployeeList.find(
            (employee) => employee.Id === values.ManagerId
          );
          values.ManagerName = `${manager.FirstName} ${manager.LastName}`;
          insertOneDepartment(values);
          return;
        }
        notification.error({
          description: "Thêm phòng ban không thành công. " + Description,
        });
        return;
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

  useEffect(() => {
    GetManyEmployee()
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          setCurrentEmployeeList(ResponseData);
          return;
        }
        notification.error({
          message: "Có lỗi",
          description:
            "Truy vấn danh sách nhân viên không thành công. " + Description,
        });
      })
      .catch((error) => {
        if (error.response) {
          notification.error({
            message: "Có lỗi ở response.",
            description: `[${error.response.statusText}]`,
          });
        } else if (error.request) {
          notification.error({
            message: "Có lỗi ở request.",
            description: error,
          });
        } else {
          notification.error({
            message: "Có lỗi ở máy khách",
            description: error.message,
          });
        }
      });
  }, []);

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{
        span: 8,
      }}
      onFinish={onSubmit}
      autoComplete="off"
      layout="vertical"
    >
      {contextHolder}
      <Form.Item
        hasFeedback
        labelCol={24}
        label="Tên"
        name="Name"
        rules={[
          {
            required: true,
            message: "Tên là trường bắt buộc.",
          },
          {
            validator: (_, value) => {
              var exist = departmentList.find(
                (department) => department.Name == value
              );
              if (!exist) return Promise.resolve();
              return Promise.reject(
                new Error(`${value} đã có trong danh sách phòng ban.`)
              );
            },
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        hasFeedback
        labelCol={24}
        label="Trưởng phòng"
        name="ManagerId"
        rules={[
          {
            required: true,
            message: "Trưởng phòng là trường bắt buộc.",
          },
        ]}
      >
        <Select>
          {currentEmployeeList.map((employee, index) => (
            <Select.Option
              key={index}
              value={employee.Id}
            >{`${employee.Id} - ${employee.FirstName} ${employee.LastName}`}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        hasFeedback
        labelCol={24}
        label="Trạng thái"
        name="Status"
        initialValue="1"
        rules={[
          {
            required: true,
            message: "Trạng thái là trường bắt buộc.",
          },
        ]}
      >
        <Select>
          <Select.Option value="1">Hoạt động</Select.Option>
          <Select.Option value="0">Không hoạt động</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export { DepartmentList };
