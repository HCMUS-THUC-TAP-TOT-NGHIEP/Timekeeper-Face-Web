import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Descriptions,
  Row,
  Skeleton,
  Space,
  Spin,
  Table,
  Typography,
  notification,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Config from "../../constant";
import { GetAssignmentDetail, _TargeType } from "./api";
const { Title } = Typography;

const ShiftAssignmentDetail = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [assignment, setAssignment] = useState({});
  const [assignmentDetail, setAssignmentDetail] = useState({});
  const [shiftDetail, setShiftDetail] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [notify, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    GetAssignmentDetail({ Id: id })
      .then((response) => {
        const { Status, ResponseData, Description } = response;
        if (Status !== 1) {
          notify.error({
            message: "Không thành công",
            description: Description,
          });
          return;
        }
        const { Assignment, ShiftDetail, EmployeeList, DepartmentList } =
          ResponseData;
        setAssignment(Assignment);
        setShiftDetail(ShiftDetail);
        setEmployeeList(EmployeeList);
        setDepartmentList(DepartmentList);
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
  }, []);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12} key="1">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              {assignment.Description}
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="">Quản lý ca làm việc</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="">{assignment.Description}</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col style={{ textAlign: "right" }} xs={24} md={12} key="2">
          <Space wrap>
            <Button
              type="primary"
              onClick={() => navigate("/shift/assignment")}
              icon={<PlusOutlined />}
            >
              Phân ca
            </Button>
            <Button
              onClick={() => navigate(`/shift/assignment/edit/${id}`)}
              type="primary"
              icon={<EditOutlined />}
            >
              Chỉnh sửa
            </Button>
          </Space>
        </Col>
      </Row>
      <Title level={4}>Thông tin chung</Title>
      <Spin spinning={loading}>
        <Skeleton loading={loading} active={loading}>
          <Content style={{ padding: "20px 0", background: colorBgContainer }}>
            <Descriptions
              bordered
              layout="vertical"
              labelStyle={{ fontWeight: "bold" }}
            >
              <Descriptions.Item label="Tiêu đề">
                {assignment.Description}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {assignment.CreatedAt
                  ? dayjs(assignment.CreatedAt).format(Config.DateFormat)
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Kiểu phân ca" name="AssignmentType">
                {assignment.AssignmentTypeName
                  ? assignment.AssignmentTypeName
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {shiftDetail.StartDate
                  ? dayjs(shiftDetail.StartDate).format(Config.DateFormat)
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">
                {shiftDetail.EndDate
                  ? dayjs(shiftDetail.EndDate).format(Config.DateFormat)
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ làm việc">
                {(shiftDetail.StartTime
                  ? dayjs(shiftDetail.StartTime, Config.TimeFormat).format(
                      Config.NonSecondFormat
                    )
                  : "... ") +
                  " - " +
                  (shiftDetail.FinishTime
                    ? dayjs(shiftDetail.FinishTime, Config.TimeFormat).format(
                        Config.NonSecondFormat
                      )
                    : " ...")}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ nghỉ">
                {(shiftDetail.BreakAt
                  ? dayjs(shiftDetail.BreakAt, Config.TimeFormat).format(
                      Config.NonSecondFormat
                    )
                  : "... ") +
                  " - " +
                  (shiftDetail.BreakEnd
                    ? dayjs(shiftDetail.BreakEnd, Config.TimeFormat).format(
                        Config.NonSecondFormat
                      )
                    : " ...")}
              </Descriptions.Item>

              <Descriptions.Item label="Số phút nghỉ">
                {shiftDetail.BreakMinutes
                  ? shiftDetail.BreakMinutes + " phút"
                  : ""}
              </Descriptions.Item>

              <Descriptions.Item label="Kiểu phân ca">
                {assignment.AssignmentTypeName
                  ? assignment.AssignmentTypeName
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày trong tuần" span={3}>
                <Checkbox.Group
                  value={
                    shiftDetail.DayIndexList ? shiftDetail.DayIndexList : []
                  }
                >
                  <Row>
                    <Col span={8}>
                      <Checkbox value={1}>Thứ 2</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value={2}>Thứ 3</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value={3}>Thứ 4</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value={4}>Thứ 5</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value={5}>Thứ 6</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value={6} checked>
                        Thứ 7
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value={0}>Chủ nhật</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={3}>
                {assignment.Note ? assignment.Note : ""}
              </Descriptions.Item>
            </Descriptions>
          </Content>
        </Skeleton>
      </Spin>
      <Title level={4}>Chi tiết</Title>
      {assignment.TargetType === _TargeType.ByEmployee ? (
        <Table
          rowKey="Id"
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
              width: 490,
              dataIndex: "TargetDescription",
              key: "TargetDescription",
            },
          ]}
          dataSource={employeeList}
          loading={loading}
          bordered
        />
      ) : assignment.TargetType === _TargeType.ByDepartment ? (
        <Table
          rowKey="Id"
          columns={[
            {
              title: "Mã",
              width: 10,
              dataIndex: "Target",
              key: "Target",
              fixed: "left",
              sortOrder: "ascend",
            },
            {
              title: "Phòng ban",
              dataIndex: "TargetDescription",
              width: 490,
              key: "TargetDescription",
            },
          ]}
          dataSource={departmentList}
          loading={loading}
          bordered
        />
      ) : (
        <></>
      )}
    </Space>
  );
};

export { ShiftAssignmentDetail };

