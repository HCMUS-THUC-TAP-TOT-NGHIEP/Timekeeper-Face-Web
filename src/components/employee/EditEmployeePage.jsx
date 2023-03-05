import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Select,
  Skeleton,
  Space,
  theme
} from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GetOneEmployeeInfo, ModifyEmployeeInfo } from "./api";
import "./style.css";

export const EditEmployeePage = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { employeeId } = useParams();
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  useEffect(() => {
    document.title = "Cập nhật hồ sơ nhân viên";
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      navigate("/login");
      return;
    }
  }, []);
  useEffect(() => {
    GetOneEmployeeInfo({ employeeId })
      .then((response) => {
        const { Status, ResponseData } = response;
        if (Status === 1) {
          setCurrentEmployee(ResponseData);
          form.setFieldsValue({
            Id: ResponseData.Id,
            LastName: ResponseData.LastName,
            FirstName: ResponseData.FirstName,
            Address: ResponseData.Address,
            Email: ResponseData.Email.trim(),
            MobilePhone: ResponseData.MobilePhone,
            Gender: ResponseData.Gender,
            DepartmentId: ResponseData.DepartmentId,
            JoinDate: dayjs(ResponseData.JoinDate),
            DateOfBirth: dayjs(ResponseData.DateOfBirth),
            Position: ResponseData.Position,
          });
          setLoading(false);
          return;
        }
      })
      .catch(() => {});
  }, [employeeId]);

  const onSubmit = (values) => {
    ModifyEmployeeInfo(values)
      .then((response) => {
        const { Status, Description } = response;
        if (Status === 1) {
          notification.success({
            description: "Cập nhật thông tin nhân viên thành công",
          });
          navigate(`/employee/${currentEmployee.Id}`);
          return;
        }
        notification.error({
          title: "Cập nhật thất bại",
          description: Description,
        });
      })
      .catch((error) => {
        if (error.response) {
          notification.error({
            title: "Request có lỗi.",
            message: `Data: [${error.response.data}], Status [${error.response.status}]`,
          });
        } else if (error.request) {
          notification.error({
            title: "Response có lỗi.",
            message: error.response,
          });
        } else {
          notification.error({
            description: error.message,
          });
        }
      });
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/employee/all">Nhân viên</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/employee/${employeeId}`}>Hồ sơ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="">Cập nhật</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button
            style={{ margin: "5px 5px" }}
            type="primary"
            ghost
            onClick={() => navigate(`/employee/edit/${employeeId}`)}
          >
            Cập nhật hồ sơ
          </Button>
          <Button
            style={{ margin: "5px 5px" }}
            type="primary"
            onClick={() => alert("Đăng ký thông tin nhận diện")}
          >
            Đăng ký thông tin nhận diện
          </Button>
        </Col>
      </Row>
      <Card style={{ background: colorBgContainer }}>
        <Title level={4}>Thông tin chi tiết</Title>
        <Skeleton loading={loading} active={loading}>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 8,
            }}
            onFinish={onSubmit}
            autoComplete="off"
            layout="vertical"
            style={{ background: colorBgContainer }}
          >
            <Row
              gutter={{
                xs: 8,
                sm: 16,
                md: 24,
                lg: 32,
              }}
            >
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item
                  hasFeedback
                  labelCol={24}
                  label="Mã NV"
                  name="Id"
                  rules={[
                    {
                      required: true,
                      message: "Mã NV là trường bắt buộc.",
                    },
                  ]}
                >
                  <Input readOnly />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item
                  hasFeedback
                  labelCol={24}
                  wrapperCol={24}
                  label="Họ & tên đệm"
                  name="LastName"
                  rules={[
                    {
                      required: true,
                      message: "Họ & tên đệm là trường bắt buộc.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item
                  hasFeedback
                  labelCol={24}
                  label="Tên"
                  name="FirstName"
                  rules={[
                    {
                      required: true,
                      message: "Tên là trường bắt buộc.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item
                  hasFeedback
                  labelCol={24}
                  label="Email"
                  name="Email"
                  rules={[
                    {
                      required: true,
                      message: "Email là trường bắt buộc",
                    },
                    {
                      pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: "Email không hợp lệ. Vui lòng nhập email khác",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item
                  hasFeedback
                  labelCol={24}
                  label="ĐTDĐ"
                  name="MobilePhone"
                  rules={[
                    {
                      required: true,
                      message: "ĐTDĐ là trường bắt buộc.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item
                  hasFeedback
                  labelCol={24}
                  label="Ngày sinh"
                  name="DateOfBirth"
                  rules={[
                    {
                      required: true,
                      message: "Ngày sinh là trường bắt buộc.",
                    },
                  ]}
                >
                  <DatePicker
                    allowClear
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item
                  hasFeedback
                  labelCol={24}
                  label="Ngày vào công ty"
                  name="JoinDate"
                  rules={[
                    {
                      required: true,
                      message: "Ngày vào là trường bắt buộc.",
                    },
                  ]}
                >
                  <DatePicker
                    allowClear
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={16}>
                <Form.Item
                  hasFeedback
                  labelCol={24}
                  label="Địa chỉ"
                  name="Address"
                  rules={[
                    {
                      required: true,
                      message: "Địa chỉ là trường bắt buộc.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item
                  hasFeedback
                  labelCol={24}
                  label="Giới tính"
                  name="Gender"
                  rules={[
                    {
                      required: true,
                      message: "Giới tính là trường bắt buộc.",
                    },
                  ]}
                >
                  <Select>
                    <Select.Option value={true}>Nam</Select.Option>
                    <Select.Option value={false}>Nữ</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item
                  hasFeedback
                  labelCol={24}
                  label="Phòng ban"
                  name="DepartmentId"
                  rules={[
                    {
                      required: true,
                      message: "Phòng ban là trường bắt buộc.",
                    },
                  ]}
                >
                  <Select>
                    <Select.Option value={0}>
                      FTS - Phòng Lập trình
                    </Select.Option>
                    <Select.Option value={1}>HR</Select.Option>
                    <Select.Option value={2}>Marketing</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item
                  hasFeedback
                  labelCol={24}
                  label="Chức vụ"
                  name="Position"
                  rules={[
                    {
                      required: true,
                      message: "Chức vụ là trường bắt buộc.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Cập nhật thông tin
              </Button>
            </Form.Item>
          </Form>
        </Skeleton>
      </Card>
    </Space>
  );
};
