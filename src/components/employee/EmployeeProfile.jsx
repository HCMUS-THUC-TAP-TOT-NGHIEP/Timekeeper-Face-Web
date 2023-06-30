import { EditFilled } from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Skeleton,
  Space,
  Spin,
  Typography,
  notification,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { GetOneEmployeeInfo } from "./api";
import "./style.css";

export const EmployeeProfile = (props) => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [notify, contextHolder] = notification.useNotification();

  useEffect(() => {
    document.title = "Hồ sơ nhân viên";
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      navigate("/login");
      return;
    }
  }, []);
  useEffect(() => {
    GetOneEmployeeInfo({ employeeId })
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          setCurrentEmployee(ResponseData);
          setLoading(false);
          return;
        }
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      });
  }, [employeeId]);
  const title = (
    <Space direction="horizontal" size={"large"} align="center">
      <Avatar
        style={{ backgroundColor: "#f56a00" }}
        size={{
          xs: 24,
          sm: 32,
          xl: 80,
        }}
      >
        <span style={{ fontSize: 20 }}>
          {(currentEmployee.FirstName || [])[0] +
            (currentEmployee.LastName || [])[0]}
        </span>
      </Avatar>
      <Title
        level={3}
        children={`${currentEmployee.LastName} ${currentEmployee.FirstName}`}
      />
    </Space>
  );

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {contextHolder}
        <Row gutter={[16, 16]} align="middle">
          <Col flex="none">
            <Space direction="vertical">
              <Skeleton loading={loading}>
                <Typography.Title level={2} style={{ marginTop: 0 }}>
                  {currentEmployee.LastName + " " + currentEmployee.FirstName}
                </Typography.Title>
              </Skeleton>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link to="/">Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/employee">Nhân viên</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to={`/employee/${employeeId}`}>
                    <Skeleton loading={loading}>
                      {currentEmployee.LastName +
                        " " +
                        currentEmployee.FirstName}
                    </Skeleton>
                  </Link>
                </Breadcrumb.Item>
              </Breadcrumb>
            </Space>
          </Col>
        </Row>
        <Skeleton loading={loading} active={loading}>
          <Content style={{ paddingTop: 10 }}>
            <Card className="boxShadow0 rounded">
              <Descriptions
                column={{
                  xxl: 2,
                  xl: 2,
                  lg: 2,
                  md: 1,
                  sm: 1,
                  xs: 1,
                }}
                title={title}
              >
                <Descriptions.Item label="ID">
                  {currentEmployee.Id}
                </Descriptions.Item>
                <Descriptions.Item label="Phòng ban/ Nhóm">
                  {currentEmployee.DepartmentName}
                </Descriptions.Item>
                <Descriptions.Item label="Vị trí">
                  {currentEmployee.Position}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày vào">
                  {new Date(
                    Date.parse(currentEmployee.JoinDate)
                  ).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="ĐTDĐ">
                  {currentEmployee.MobilePhone}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {currentEmployee.Address}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {currentEmployee.Email}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  {currentEmployee.Gender ? "Nam" : "Nữ"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Content>
        </Skeleton>
      </Space>
    </Spin>
  );
};
