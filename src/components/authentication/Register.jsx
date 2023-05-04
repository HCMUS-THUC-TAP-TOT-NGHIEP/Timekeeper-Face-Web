import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Space,
  Typography,
  notification,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { RegisterAccount } from "./api";
const { Title, Text } = Typography;

const RegisterPage = (props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [notify, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Đăng ký tài khoản";
  }, []);
  const onSubmit = (values) => {
    setLoading(true);
    RegisterAccount(values)
      .then((response) => {
        const { Status, Description } = response;
        if (Status !== 1) {
          notify.error({
            message: "Đăng ký không thành công",
            description: Description,
          });
          return;
        }
        navigate("/login");
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
  };
  return (
    <Layout style={{ height: "100vh" }}>
      {contextHolder}
      <Row
        style={{
          height: "inherit",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Col xs={2} sm={4} md={6} lg={8} />
        <Col xs={20} sm={16} md={12} lg={8}>
          <Content
            style={{
              background: colorBgContainer,
              margin: "auto",
              padding: 40,
            }}
          >
            <Title level={1} style={{ textAlign: "center" }}>
              Đăng ký tài khoản
            </Title>
            <Form
              name="basic"
              onFinish={onSubmit}
              autoComplete="off"
              layout="vertical"
              style={{ background: colorBgContainer }}
            >
              <Form.Item
                label="Username"
                name="Username"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập username",
                  },
                  {
                    min: 5,
                    message: "Username cần ít nhất 5 ký tự",
                  },
                  {
                    max: 12,
                    message: "Username cho phép tối đa 12 ký tự",
                  },
                ]}
                hasFeedback
              >
                <Input size="large" placeholder="khanhnt" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="Email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email.",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ",
                  },
                ]}
                hasFeedback
              >
                <Input size="large" placeholder="mail@mail.com" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="Password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu.",
                  },
                  {
                    min: 8,
                    message: "Mật khẩu cần tối thiểu 8 ký tự",
                  },
                  {
                    max: 20,
                    message: "Mật khẩu cho phép tối đa 20 ký tự",
                  },
                  {
                    pattern: new RegExp(Config.PasswordPattern),
                    message:
                      "Mật khẩu phải có ít nhất một số, một ký tự thường, một ký tự hoa và một ký tự đặc biệt!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item
                label="Nhập lại mật khẩu"
                name="confirm"
                dependencies={["Password"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập lại mật khẩu",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("Password") === value) {
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
                  loading={loading}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
            <Space
              direction="vertical"
              style={{ width: "100%" }}
              align="center"
            >
              <Text level={5}>
                Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </Text>
            </Space>
          </Content>
        </Col>
        <Col xs={2} sm={4} md={6} lg={8} />
      </Row>
    </Layout>
  );
};

export default RegisterPage;
