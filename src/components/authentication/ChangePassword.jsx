import { Breadcrumb, Button, Col, Form, Input, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import Config from "../../constant";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { changePasswordBE } from "./api";

const ChangePasswordPage = ({ notify, loginRequired, ...rest }) => {
  const [loadingButton, setLoadingButton] = useState(false);
  const navigate = useNavigate();
  const userDetails = useAuthState();

  useEffect(() => {
    if (loginRequired && !userDetails.token) {
      notify.warning({
        message: "Yêu cầu đăng nhập để đổi mật khẩu.",
      });
      navigate("/login");
      return;
    }
    document.title = "Đổi mật khẩu";
  }, []);
  const changePassword = async (values) => {
    try {
      setLoadingButton(true);
      const { Status, Description } = await changePasswordBE(values);
      if (Status === 1) {
        notify.success({
          message: "Bạn vừa đổi mật khẩu thành công",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
        return;
      }
      notify.error({
        message: "Không thành công",
        description: Description,
      });
    } catch (error) {
      handleErrorOfRequest({ notify, error });
    } finally {
      setLoadingButton(false);
    }
  };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/manage/account">Profile</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="">Đổi mật khẩu</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Form layout="vertical" onFinish={changePassword}>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Nhập mật khẩu hiện tại"
              name="Password"
              required
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu hiện tại",
                },
              ]}
              hasFeedback
            >
              <Input.Password size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Mật khẩu mới"
              name="NewPassword"
              required
              dependencies={["Password"]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu mới",
                },
                {
                  min: 8,
                  message: "Mật khẩu tối thiểu 8 ký tự",
                },
                {
                  pattern: new RegExp(Config.PasswordPattern),
                  message:
                    "Mật khẩu phải có ít nhất một số, một ký tự thường, một ký tự hoa và một ký tự đặc biệt!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("Password") !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Vui lòng nhập mật khẩu mới khác với mật khẩu cũ!"
                      )
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Nhập lại mật khẩu mới"
              name="Confirm"
              required
              dependencies={["NewPassword"]}
              rules={[
                {
                  max: 100,
                  message: "Tên chỉ được tối đa 100 ký tự",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("NewPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Nhập lại mật khẩu không khớp nhau!")
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item>
            <Space direction="horizontal">
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                size="large"
                loading={loadingButton}
              >
                Lưu
              </Button>
              <Button size="large" onClick={() => navigate(-1)}>
                Quay lại
              </Button>
            </Space>
          </Form.Item>
        </Row>
      </Form>
    </Space>
  );
};

export { ChangePasswordPage };
