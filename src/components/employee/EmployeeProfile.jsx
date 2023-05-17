import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  notification,
  Row,
  Skeleton,
  Space,
} from "antd";
import Meta from "antd/es/card/Meta";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
      });
  }, [employeeId]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
      <Row>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/employee/all">Nhân viên</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="">Hồ sơ</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button
            style={{ margin: "5px 5px" }}
            type="primary"
            ghost
            onClick={() => navigate(`/employee/edit/${employeeId}`)}
          >
            Cập nhật hồ sơ
          </Button>
        </Col>
      </Row>
      <Card bordered={false}>
        <Skeleton avatar loading={loading} active={loading}>
          <Meta
            avatar={
              <Avatar
                style={{ backgroundColor: "#f56a00" }}
                size={{
                  xs: 24,
                  sm: 32,
                  md: 80,
                  lg: 100,
                  xl: 120,
                }}
              >
                {currentEmployee.FirstName}
              </Avatar>
            }
            description=<Descriptions
              column={{
                xxl: 2,
                xl: 2,
                lg: 2,
                md: 1,
                sm: 1,
                xs: 1,
              }}
              title={`${currentEmployee.LastName} ${currentEmployee.FirstName}`}
            >
              <Descriptions.Item label="ID">
                {currentEmployee.Id}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng ban/ Nhóm">
                UI/UX Design Team
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
          />
        </Skeleton>
      </Card>
    </Space>
  );
};
