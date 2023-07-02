import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  theme,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { GetDepartmentList } from "../department/api";
import { GetOneEmployeeInfo, ModifyEmployeeInfo } from "./api";
import locale from "antd/es/date-picker/locale/vi_VN";
import "./style.css";

export const EditEmployeePage = ({ loginRequired, ...rest }) => {
  const navigate = useNavigate();
  const [notify, contextHolder] = notification.useNotification();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { employeeId } = useParams();
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [departmentList, setDepartmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();
  const userDetails = useAuthState();
  useEffect(() => {
    if (loginRequired) {
      if (!userDetails.token) {
        navigate("/login");
        return;
      }
    }
  }, []);
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        var response = await GetOneEmployeeInfo({ employeeId });
        const { Status, ResponseData } = response;
        if (Status === 1) {
          response = await GetDepartmentList();
          var { DepartmentList } = response.ResponseData;
          setDepartmentList(DepartmentList || []);
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
          return;
        }
      } catch (error) {
        handleErrorOfRequest({ notify, error });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [employeeId]);

  const onSubmit = (values) => {
    setProcessing(true);
    ModifyEmployeeInfo(values)
      .then((response) => {
        const { Status, Description } = response;
        if (Status === 1) {
          notification.success({
            message: <b>Thông báo</b>,
            description: <div>Cập nhật thông tin nhân viên thành công</div>,
          });
          navigate(`/employee/${currentEmployee.Id}`);
          return;
        }
        throw new Error(Description);
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
      <Row gutter={[16, 16]} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Skeleton loading={loading}>
              <Typography.Title level={2} style={{ marginTop: 0 }}>
                {currentEmployee.LastName + " " + currentEmployee.FirstName}
              </Typography.Title>
            </Skeleton>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/employee/all">Nhân viên</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={`/employee/${employeeId}`}>
                  <Skeleton loading={loading}>
                    {currentEmployee.LastName + " " + currentEmployee.FirstName}
                  </Skeleton>
                </Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <Content style={{ background: colorBgContainer, padding: 20 }}>
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
                        pattern:
                          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
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
                      locale={locale}
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
                      locale={locale}
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
                      options={(departmentList || []).map((department) => ({
                        value: department.Id,
                        label: department.Name,
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
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={processing}
                >
                  Cập nhật thông tin
                </Button>
              </Form.Item>
            </Form>
          </Skeleton>
        </Content>
      </Spin>
    </Space>
  );
};
