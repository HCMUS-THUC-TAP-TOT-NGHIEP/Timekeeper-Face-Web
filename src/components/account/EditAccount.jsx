import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Tooltip,
  notification,
} from "antd";
import React, { useState } from "react";
import { UpdateUser } from "./api";

const EditAccount = (props) => {
  const { account, editAccountFE } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notify, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [readonlyForm, setReadonlyForm] = useState(
    props.isReadOnly ? true : false
  );
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showEditForm = () => {
    setIsModalOpen(true);
  };
  const modifyAccountBE = async (values) => {
    var success = false;
    setLoading(true);
    UpdateUser(values)
      .then((response) => {
        const { Status, Description } = response;
        if (Status === 1) {
          notify.success({
            message: "Đã cập nhật tài khoản " + account.Username,
          });
          account.Name = values.Name;
          account.EmailAddress = values.EmailAddress;
          editAccountFE(account);
          success = true;
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
      })
      .finally(() => {
        setLoading(false);
        if (success) {
          handleCancel();
        }
      });
  };

  return (
    <Space>
      <Tooltip title="Chỉnh sửa">
        <Button type="text" icon={<EditOutlined />} onClick={showEditForm} />
      </Tooltip>
      <Modal
        title={<Space>Chỉnh sửa người dùng</Space>}
        open={isModalOpen}
        keyboard={true}
        closable={true}
        maskClosable={true}
        footer={null}
        destroyOnClose={true}
        onCancel={handleCancel}
        width={700}
        bodyStyle={{ width: "100%" }}
      >
        <Form
          preserve={false}
          layout="vertical"
          onFinish={modifyAccountBE}
          initialValues={{
            Username: account.Username,
            EmailAddress: account.EmailAddress,
            Name: account.Name,
          }}
          style={{ width: "100%" }}
        >
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
                  {
                    max: 20,
                    message: "Username chỉ cho phép tối đa 20 ký tự",
                  },
                  {
                    min: 5,
                    message: "Username cần tối thiểu 5 ký tự",
                  },
                ]}
              >
                <Input placeholder="Username" readOnly />
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
                <Input placeholder="Nhập Họ tên" readOnly={readonlyForm} />
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
                <Input placeholder="Nhập Email" readOnly={readonlyForm} />
              </Form.Item>
            </Col>
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

export { EditAccount };
