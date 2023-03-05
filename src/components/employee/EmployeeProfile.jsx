import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
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
      .catch((error) => {});
  }, [employeeId]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false}>
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
          <Button
            style={{ margin: "5px 5px" }}
            type="primary"
            onClick={() => alert("Đăng ký thông tin nhận diện")}
          >
            Đăng ký thông tin nhận diện
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
            description=<Row style={{ width: "100%" }}>
              <Col span={12}>
                <Descriptions
                  column={1}
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
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions column={1}>
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
              </Col>
            </Row>
          />
        </Skeleton>
      </Card>
    </Space>
  );
};
