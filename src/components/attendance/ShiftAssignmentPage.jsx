import { PlusOutlined } from "@ant-design/icons";
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
  Space,
  theme,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import TextArea from "antd/es/input/TextArea";
import { Content } from "antd/es/layout/layout";
import React from "react";
import { Link } from "react-router-dom";
import { AssignShift } from "./api";

const ShiftAssignmentPage = (props) => {
  const [form] = Form.useForm();
  const [notify, contextHolder] = notification.useNotification();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const assignShift = (values) => {
    console.log(values);
    AssignShift(values)
      .then((response) => {
        console.log(response);
        const { Status, ResponseData, Description } = response;
        if (Status === 1) {
          notify.success({
            description: "Tạo mới phân ca thành công.",
          });
          return;
        }
        notify.error({
          message: "Thất bại",
          description: Description,
        });
      })
      .catch((error) => {
        if (error.response) {
          notify.error({
            message: "Có lỗi",
            description: `[${error.response.statusText}]`,
          });
        } else if (error.request) {
          notify.error({
            message: "Có lỗi.",
            description: error,
          });
        } else {
          notify.error({
            message: "Có lỗi.",
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
              <Link to="/shift">Quản lý ca làm việc</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="">Phân ca</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button type="primary" icon={<PlusOutlined />}>
            Tạo phân ca mới
          </Button>
        </Col>
      </Row>
      <Content style={{ background: colorBgContainer, padding: 20 }}>
        <Form form={form} layout="vertical" onFinish={assignShift}>
          <Row gutter={24}>
            <Col xs={24} sm={12} key="1">
              <Form.Item
                label="Tiêu đề"
                name="Description"
                required
                rules={[
                  {
                    required: true,
                    message: "Tiêu đề là trường bắt buộc.",
                  },
                ]}
              >
                <Input placeholder="Nhập tiêu đề" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} key="2">
              <Form.Item
                label="Kiểu phân ca"
                name="AssignType"
                required
                rules={[
                  {
                    required: true,
                    message: "Kiểu phân ca là trường bắt buộc.",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn kiểu phân ca"
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    if (!option) return false;
                    return (option.label || "")
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  options={[
                    {
                      value: 1,
                      label: "Phân ca cho phòng ban, vị trí",
                    },
                    {
                      value: 2,
                      label: "Phân ca cho nhân viên",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} key="3">
              <Form.Item
                label="Loại ca"
                name="ShiftId"
                required
                rules={[
                  {
                    required: true,
                    message: "Loại ca ca là trường bắt buộc.",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn loại ca"
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    if (!option) return false;
                    return (option.label || "")
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  options={[
                    {
                      value: 1,
                      label: "Ca hành chính",
                    },
                    {
                      value: 2,
                      label: "Ca lễ",
                    },
                    {
                      value: 3,
                      label: "Ca kíp",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} key="4">
              <Form.Item label="Phòng ban" name="DepartmentId">
                <Select
                  showSearch
                  placeholder="Chọn phòng ban"
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    if (!option) return false;
                    return (option.label || "")
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  mode="multiple"
                  options={[
                    {
                      value: 0,
                      label: "Tất cả",
                    },
                    {
                      value: 1,
                      label: "HR - Nhân sự",
                    },
                    {
                      value: 7,
                      label: "Marketing",
                    },
                    {
                      value: 2,
                      label: "Phòng Lập trình",
                    },
                    {
                      value: 13,
                      label: "Bảo hành",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} key="5">
              <Form.Item label="Vị trí" name="DesignationId">
                <Select
                  showSearch
                  placeholder="Chọn vị trí"
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    if (!option) return false;
                    return (option.label || "")
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  mode="multiple"
                  options={[
                    {
                      value: 1,
                      label: "Giám đốc",
                    },
                    {
                      value: 2,
                      label: "Web design",
                    },
                    {
                      value: 3,
                      label: "Trưởng phòng",
                    },
                    {
                      value: 4,
                      label: "Mobile Developer",
                    },
                    {
                      value: 5,
                      label: "QC",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} key="6">
              <Form.Item
                label="Từ ngày"
                name="StartDate"
                rules={[
                  {
                    required: true,
                    message: "Từ ngày là trường bắt buộc chọn.",
                  },
                ]}
              >
                <DatePicker
                  allowClear
                  format="DD/MM/YYYY"
                  locale={locale}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} key="7">
              <Form.Item label="đến ngày" name="EndDate">
                <DatePicker
                  allowClear
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  locale={locale}
                />
              </Form.Item>
            </Col>
            <Col span={24} key="8">
              <Form.Item label="Ghi chú" name="Note">
                <TextArea
                  showCount
                  maxLength={1000}
                  style={{
                    height: 120,
                    marginBottom: 24,
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="middle">
                  Cập nhật
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Content>
    </Space>
  );
};

export { ShiftAssignmentPage };
