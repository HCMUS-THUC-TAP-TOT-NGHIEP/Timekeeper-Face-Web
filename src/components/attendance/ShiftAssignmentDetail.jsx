import {
  Breadcrumb,
  Button,
  Col,
  Descriptions,
  List,
  notification,
  Row,
  Skeleton,
  Space,
  Table,
  Tabs,
  theme,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { GetAssignmentDetail } from "./api";
const { Title } = Typography;

const dateFormat = "DD/MM/YYYY";

const _TargeType = {
  ByDepartment: 1,
  ByEmployee: 2,
};

const ShiftAssignmentDetail = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [shiftAssignment, setShiftAssignment] = useState({
    AssignType: undefined,
    AssignmentTypeName: undefined,
    CreatedAt: undefined,
    CreatedBy: undefined,
    Description: undefined,
    Detail: [],
    EndDate: undefined,
    Id: undefined,
    Note: undefined,
    ShiftId: undefined,
    StartDate: undefined,
  });
  const [notify, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    GetAssignmentDetail({ Id: id })
      .then((response) => {
        console.log(response);
        const { Status, ResponseData, Description } = response;
        if (Status !== 1) {
          notify.error({
            message: "Thất bại",
            description: Description,
          });
          return;
        }
        setShiftAssignment(ResponseData);
        setLoading(false);
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
  }, []);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
      <Skeleton loading={loading} active={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} key="1">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="">Quản lý ca làm việc</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="">{shiftAssignment.Description}</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col style={{ textAlign: "right" }} xs={24} md={12} key="2">
            <Space wrap>
              <Button
                type="primary"
                onClick={() => navigate("/shift/assignment")}
                icon={<PlusOutlined />}
              >
                Tạo phân ca làm việc mới
              </Button>
            </Space>
          </Col>
        </Row>
        <Title level={4}>Thông tin chung</Title>
        <Content style={{ padding: 20, background: colorBgContainer }}>
          <Row gutter={24}>
            <Descriptions
              column={{
                xxl: 2,
                xl: 2,
                lg: 2,
                md: 2,
                sm: 1,
                xs: 1,
              }}
              title={shiftAssignment.Description}
              extra={<Button type="primary">Chỉnh sửa</Button>}
            >
              <Descriptions.Item label="Tiêu đề">
                {shiftAssignment.Description}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {dayjs(shiftAssignment.CreatedDate).format(dateFormat)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {dayjs(shiftAssignment.StartDate).format(dateFormat)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">
                {dayjs(shiftAssignment.EndDate).format(dateFormat)}
              </Descriptions.Item>
              <Descriptions.Item label="Kiểu phân ca">
                {shiftAssignment.AssignmentTypeName}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {shiftAssignment.Note}
              </Descriptions.Item>
            </Descriptions>
          </Row>
        </Content>
        <Title level={4}>Chi tiết</Title>
        <Tabs
          type="card"
          items={[
            {
              key: 2,
              label: "Phòng ban",
              children: (
                <Table
                  columns={[
                    {
                      title: "Mã",
                      width: 10,
                      dataIndex: "Target",
                      key: "Target",
                      fixed: "left",
                    },

                    {
                      title: "Phòng ban",
                      width: 100,
                      dataIndex: "TargetDescription",
                      key: "TargetDescription",
                    },
                  ]}
                  dataSource={shiftAssignment.Detail.filter(
                    (s) =>
                      s.TargetType && s.TargetType == _TargeType.ByDepartment
                  )}
                />
              ),
            },
            {
              key: 1,
              label: "Cá nhân",
              children: (
                <Table
                  columns={[
                    {
                      title: "Mã",
                      width: 10,
                      dataIndex: "Target",
                      key: "Target",
                      fixed: "left",
                    },

                    {
                      title: "Nhân viên",
                      width: 100,
                      dataIndex: "TargetDescription",
                      key: "TargetDescription",
                    },
                  ]}
                  dataSource={shiftAssignment.Detail.filter(
                    (s) => s.TargetType && s.TargetType == _TargeType.ByEmployee
                  )}
                />
              ),
            },
          ]}
        />
      </Skeleton>
    </Space>
  );
};

export { ShiftAssignmentDetail };
