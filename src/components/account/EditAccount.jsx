import { EditTwoTone } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { GetUserRoleList, UpdateUser } from "./api";

const EditAccount = (props) => {
  const { account, editAccountFE } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notify, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [readonlyForm, setReadonlyForm] = useState(
    props.isReadOnly ? true : false
  );
  const [roleList, setRoleList] = useState([]);

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
        let { Status, ResponseData, Description } = response;
        if (Status === 1) {
          notify.success({
            message: <b>Thông báo</b>,
            description: "Đã cập nhật tài khoản " + account.Username,
          });
          let { User } = ResponseData;
          editAccountFE(User);
          success = true;
          return;
        }
        notify.error({
          message: "Không thành công",
          description: Description,
        });
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      })
      .finally(() => {
        setLoading(false);
        if (success) {
          handleCancel();
        }
      });
  };

  useEffect(() => {
    if (!isModalOpen) {
      setRoleList([]);
      return;
    }

    loadData();
  }, [isModalOpen]);

  async function loadData() {
    try {
      setLoading(true);
      let response = await GetUserRoleList();
      if (response.Status === 1) {
        let { RoleList } = response.ResponseData;
        setRoleList(RoleList);
      }
    } catch (error) {
      handleErrorOfRequest({ error: error, notify: notify });
    } finally {
      setLoading(false);
    }
  }
  const title = (
    <Space direction="horizontal" align="center" style={{ fontSize: 20 }}>
      <EditTwoTone />
      Chỉnh sửa người dùng
    </Space>
  );

  return (
    <Space>
      <Tooltip title="Chỉnh sửa">
        <Button type="text" icon={<EditTwoTone />} onClick={showEditForm} />
      </Tooltip>
      <Modal
        title={title}
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
            Role: account.Role,
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
                label="Phân quyền"
                name="Role"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phân quyền",
                  },
                ]}
              >
                <Select
                  options={roleList.map((role) => ({
                    label: role.Description,
                    value: role.Id,
                  }))}
                  loading={loading}
                ></Select>
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
