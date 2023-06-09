import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  notification,
  Row,
  Space,
  theme,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import { RequestResetLink, ResetPassword } from "./api";
import { handleErrorOfRequest } from "../../utils/Helpers";
const { Content } = Layout;
const { Title, Text } = Typography;

export const ForgotPasswordPage = function ({ notify, ...rest }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const userDetails = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails.token) {
      navigate("/dashboard");
    }
    document.title = "Quên mật khẩu";
  }, []);
  const onSubmit = (values) => {
    var requestData = {
      email: values.email,
    };
    RequestResetLink(requestData)
      .then((response) => {
        const { Status, Description } = response;
        if (Status !== 1) {
          notify.error({
            message: "Reset password failed",
            description: Description,
          });
          return;
        }
        notification.info({
          description: "Link reset mật khẩu đã được gửi về email của bạn.",
        });
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      });
  };
  return (
    <Layout style={{ height: "100vh" }}>
      <Row
        style={{
          height: "inherit",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Col xs={2} sm={4} md={6} />
        <Col xs={20} sm={16} md={12}>
          <Content
            style={{
              background: colorBgContainer,
              margin: "auto",
              padding: 40,
              maxWidth: 600,
            }}
          >
            <Title level={1} style={{ textAlign: "center" }}>
              Đặt lại mật khẩu
            </Title>
            <Title
              level={5}
              type="secondary"
              style={{ textAlign: "center", marginBottom: 30 }}
            >
              Nhập email của bạn để nhận link đặt lại mật khẩu
            </Title>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onSubmit}
              autoComplete="off"
              layout="vertical"
              style={{ background: colorBgContainer }}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message:
                      "Vui lòng nhập email liên kết với tài khoản của bạn!",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ.",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  size="large"
                >
                  Gửi yêu cầu
                </Button>
              </Form.Item>
            </Form>
            <Space
              direction="vertical"
              style={{ width: "100%" }}
              align="center"
            >
              <Space direction="horizontal">
                Bạn nhớ được mật khẩu của mình?
                <Link to="/login">Đăng nhập</Link>
              </Space>
            </Space>
          </Content>
        </Col>
        <Col xs={2} sm={4} md={6} />
      </Row>
    </Layout>
  );
};

export const ResetPasswordPage = function ({ notify, ...rest }) {
  const { access_token } = useParams();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Đặt lại mật khẩu";
  }, []);
  const onSubmit = (values) => {
    var requestData = {
      new_password: values.new_password,
      access_token: access_token,
    };
    ResetPassword(requestData)
      .then((response) => {
        console.log(response);
        const { Status, Description } = response;
        if (Status !== 1) {
          notify.error({
            message: "Reset password failed",
            description: Description,
          });
        }
        notification.success({
          message: "Reset password successfully",
        });
        navigate("/login");
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      });
  };
  return (
    <Layout style={{ height: "100vh" }}>
      <Row
        style={{
          height: "inherit",
          alignItems: "center",
          justifyContent: "center",
        }}
        gutter={[16, 16]}
      >
        <Col xs={2} sm={4} md={4} lg={4} xl={4} />
        <Col xs={20} sm={16} md={16} lg={16} xl={16}>
          <Content
            style={{
              background: colorBgContainer,
              margin: "auto",
              padding: 40,
            }}
          >
            <Title level={1} style={{ textAlign: "center" }}>
              Reset Password
            </Title>
            <Title
              level={5}
              type="secondary"
              style={{ textAlign: "center", marginBottom: 30 }}
            >
              Enter new password
            </Title>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onSubmit}
              autoComplete="off"
              layout="vertical"
              style={{ background: colorBgContainer }}
            >
              <Form.Item
                label="New Password"
                name="new_password"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                  {
                    pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                    message:
                      "Password is not strong enough. Password must include uppercase, lowercase, number and special characters",
                  },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters.",
                  },
                ]}
                hasFeedback
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirm"
                dependencies={["new_password"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu chưa trùng khớp!")
                      );
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  size="large"
                >
                  Reset password
                </Button>
              </Form.Item>
            </Form>
            <Space
              direction="vertical"
              style={{ width: "100%" }}
              align="center"
            >
              <Text level={5}>
                Remember your password?
                <Text underline>
                  <Link to="/login">Đăng nhập</Link>
                </Text>
              </Text>
            </Space>
          </Content>
        </Col>
        <Col xs={2} sm={4} md={4} lg={4} xl={4} />
      </Row>
    </Layout>
  );
};
