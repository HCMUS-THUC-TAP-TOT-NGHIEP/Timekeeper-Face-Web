import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Space,
  notification,
} from "antd";
import React, { useState } from "react";
import Config from "../../constant";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { AddNewUser } from "./api";

const AddAccount = (props) => {
  const { insertFE } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notify, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const insertAccountBE = async (values) => {
    var success = false;
    try {
      setLoading(true);
      var response = await AddNewUser(values);
      const { Status, ResponseData, Description } = response;
      if (Status === 1) {
        success = true;
        values.Id = ResponseData.Id;
        notify.success({
          message: "Thêm mới tài khoản thành công",
        });
        return;
      }
      notify.error({
        message: "Không thành công",
        description: Description,
      });
    } catch (error) {
      handleErrorOfRequest({ notify, error });
    } finally {
      setLoading(false);
      if (success) {
        insertFE(values);
        handleCancel();
      }
    }
  };

  return (
    <Space>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Thêm người dùng
      </Button>
      <Modal
        title={<Space>Thêm người dùng</Space>}
        open={isModalOpen}
        keyboard={true}
        closable={true}
        footer={null}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form preserve={false} layout="vertical" onFinish={insertAccountBE}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Username"
                name="Username"
                required
                rules={[
                  {
                    required: true,
                    message: "Username là trường bắt buộc.",
                  },
                ]}
              >
                <Input placeholder="Username" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên"
                name="Name"
                rules={[
                  {
                    min: 5,
                    message: "Tên phải tối thiểu 5 ký tự",
                  },
                  {
                    max: 100,
                    message: "Tên chỉ được tối đa 100 ký tự",
                  },
                ]}
              >
                <Input placeholder="Nhập Họ tên" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24}>
              <Form.Item
                label="Email"
                name="EmailAddress"
                required
                rules={[
                  {
                    required: true,
                    message: "Email là trường bắt buộc.",
                  },
                  {
                    type: "email",
                    message: "Email chưa hợp lệ.",
                  },
                ]}
              >
                <Input placeholder="Nhập Email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mật khẩu"
                name="Password"
                required
                rules={[
                  {
                    min: 8,
                    message: "Mật khẩu phải tối thiểu 8 ký tự",
                  },
                  {
                    max: 20,
                    message: "Mật khẩu có tối đa 20 ký tự",
                  },
                  {
                    pattern: new RegExp(Config.PasswordPattern),
                    message:
                      "Mật khẩu phải có ít nhất một số, một ký tự thường, một ký tự hoa và một ký tự đặc biệt!",
                  },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Nhắc lại mật khẩu"
                name="Confirm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhắc lại mật khẩu của bạn",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("Password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Nhập lại mật khẩu không khớp nhau!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Divider />
            <Col xs={24} md={24}>
              <Form.Item
                label="Xác thực mật khẩu"
                name="ConfirmPassword"
                required
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu xác nhận!",
                  },
                ]}
                tooltip="Cung cấp mật khẩu của bạn"
              >
                <Input.Password />
              </Form.Item>
            </Col>
            {/* <Col xs={24} md={24}>
            <Form.Item
              label="Vai trò"
              name="Role"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn vai trò",
                },
              ]}
            >
              <Input.Password placeholder="Nhập Họ tên" />
            </Form.Item>
          </Col> */}
          </Row>
          <Form.Item>
            <Space direction="horizontal">
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                size="middle"
                loading={loading}
              >
                Lưu
              </Button>
              <Button size="middle" onClick={handleCancel}>
                Quay lại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </Space>
  );
};

export { AddAccount };

