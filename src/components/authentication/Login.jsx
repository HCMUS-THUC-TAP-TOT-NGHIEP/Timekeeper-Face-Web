import { Button, Col, Form, Input, Layout, Row, Typography, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../../Contexts/AuthContext";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { LoginAccount2 } from "./api";

const LoginPage = (props) => {
  const { notify } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useAuthDispatch();
  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);
  const onSubmit = (values) => {
    setLoading(true);
    LoginAccount2(dispatch, values)
      .then((response) => {
        const { Status, Description } = response;
        if (Status !== 1) {
          notify.error({
            message: "Đăng nhập không thành công",
            description: Description,
          });
          return;
        }
        navigate("/"); // redirect to home page
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      })
      .finally((done) => {
        setLoading(false);
      });
  };
  return (
    <Layout
      style={{
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <Row
        style={{
          height: "inherit",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Col xs={2} sm={4} md={6} />
        <Col xs={20} sm={16} md={12}>
          <Typography.Title level={1} style={{ textAlign: "center" }}>
            Đăng nhập
          </Typography.Title>
          <Content
            style={{
              background: colorBgContainer,
              margin: "auto",
              padding: 40,
              maxWidth: 600,
            }}
          >
            <Form
              onFinish={onSubmit}
              autoComplete="off"
              layout="vertical"
              style={{ background: colorBgContainer }}
            >
              <Form.Item
                label="Username hoặc email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập username hoặc email của bạn!",
                  },
                ]}
                hasFeedback
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu của bạn!",
                  },
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
                  Đăng nhập
                </Button>
                <Link to="/forgotpwd">Quên mật khẩu?</Link>
              </Form.Item>
            </Form>
          </Content>
        </Col>
        <Col xs={2} sm={4} md={6} />
      </Row>
    </Layout>
  );
};

export default LoginPage;
