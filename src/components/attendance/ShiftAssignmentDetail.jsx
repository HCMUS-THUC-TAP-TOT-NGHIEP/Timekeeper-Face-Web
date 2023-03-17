import {
  Breadcrumb,
  Button,
  Col,
  Descriptions,
  List,
  Row,
  Space,
  Table,
  Tabs,
  theme,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
const { Title } = Typography;

const dateFormat = "DD/MM/YYYY";

const _TargeType = {
  ByEmployee: 1,
  ByDepartment: 2,
  ByDesignation: 3,
};

const ShiftAssignmentDetail = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [shiftAssignment, setShiftAssignment] = useState({
    Id: 3,
    Description: "Phân ca tháng 3",
    StartDate: new Date(),
    EndDate: new Date(),
    AssignType: 1,
    CreatedDate: new Date(),
    DepartmentId: [1, 2],
    EmployeeId: [1, 2],
    DesignationId: [1, 2],
    Note: "",
  });

  const [shiftAssignmentDetail, setShiftAssignmentDetail] = useState([
    {
      Id: 1,
      Target: 1,
      TargetType: _TargeType.ByEmployee,
    },
    {
      Id: 3,
      Target: 1,
      TargetType: _TargeType.ByDesignation,
    },
    {
      Id: 2,
      Target: 1,
      TargetType: _TargeType.ByDepartment,
    },
    {
      Id: 4,
      Target: 2,
      TargetType: _TargeType.ByDepartment,
    },
  ]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="">Quản lý ca làm việc</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="">{shiftAssignment.Description}</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
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
        <Descriptions
          column={{
            xxl: 2,
            xl: 2,
            lg: 2,
            md: 2,
            sm: 2,
            xs: 1,
          }}
          title={shiftAssignment.Description}
          extra={<Button type="primary">Chỉnh sửa</Button>}
        >
          <Descriptions.Item label="Tiêu đề" span={1}>
            {shiftAssignment.Description}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo" span={1}>
            {dayjs(shiftAssignment.CreatedDate).format(dateFormat)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày bắt đầu" span={1}>
            {dayjs(shiftAssignment.StartDate).format(dateFormat)}
          </Descriptions.Item>
          <Descriptions.Item label="Kiểu phân ca" span={1}>
            {shiftAssignment.AssignType}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc" span={1}>
            {dayjs(shiftAssignment.EndDate).format(dateFormat)}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú" span={2}>
            {shiftAssignment.Note}
          </Descriptions.Item>
        </Descriptions>
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
                    dataIndex: "Id",
                    key: "Id",
                    fixed: "left",
                  },

                  {
                    title: "Phòng ban",
                    width: 100,
                    dataIndex: "name",
                    key: "name",
                  },
                ]}
                dataSource={shiftAssignmentDetail.filter(
                  (s) => s.TargetType == _TargeType.ByDepartment
                )}
              />
            ),
          },
          {
            key: 3,
            label: "Vị trí",
            children: (
              <Table
                columns={[
                  {
                    title: "Mã",
                    width: 10,
                    dataIndex: "Id",
                    key: "Id",
                    fixed: "left",
                  },

                  {
                    title: "Vị trí",
                    width: 100,
                    dataIndex: "name",
                    key: "name",
                  },
                ]}
                dataSource={shiftAssignmentDetail.filter(
                  (s) => s.TargetType == _TargeType.ByDesignation
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
                    dataIndex: "Id",
                    key: "Id",
                    fixed: "left",
                  },

                  {
                    title: "Nhân viên",
                    width: 100,
                    dataIndex: "name",
                    key: "name",
                  },
                ]}
                dataSource={shiftAssignmentDetail.filter(
                  (s) => s.TargetType == _TargeType.ByEmployee
                )}
              />
            ),
          },
        ]}
      />
    </Space>
  );
};

export { ShiftAssignmentDetail };
