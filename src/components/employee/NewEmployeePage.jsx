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
  Space,
  Spin,
  theme,
} from "antd";
import Title from "antd/es/typography/Title";
import "dayjs/locale/vi";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { GetDepartmentList } from "../department/api";
import { AddNewEmployee } from "./api";
import "./style.css";

export const NewEmployeePage = (props) => {
  const navigate = useNavigate();
  const [notify, contextHolder] = notification.useNotification();
  const [departmentList, setDepartmentList] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [form] = Form.useForm();
  useEffect(() => {
    document.title = "Thêm hồ sơ nhân viên";
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      navigate("/login");
      return;
    }
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      var response = await GetDepartmentList();
      if (response.Status === 1) {
        var { DepartmentList } = response.ResponseData;
        setDepartmentList(DepartmentList);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = (values) => {
    AddNewEmployee(values)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          notification.success({
            description: "Thêm thông tin nhân viên mới thành công",
          });
          navigate(`/employee/${ResponseData.Id}`);
          return;
        }
        notification.error({
          title: "Thêm thông tin nhân viên mới Không thành công",
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
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/employee/all">Nhân viên</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="">Thêm mới</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Card style={{ background: colorBgContainer }}>
        <Title level={4}>Thêm nhân viên mới</Title>
        <Spin spinning={loading}>
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
                    format={Config.DateFormat}
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
                    format={Config.DateFormat}
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
                  <Select
                    loading={loading}
                    options={(departmentList || []).map((record) => ({
                      label: record.Name,
                      value: record.Id,
                    }))}
                  ></Select>
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
                Thêm mới
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </Space>
  );
};
