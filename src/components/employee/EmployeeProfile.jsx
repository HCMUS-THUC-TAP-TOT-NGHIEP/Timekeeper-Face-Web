import { EditFilled } from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Descriptions,
  Row,
  Skeleton,
  Space,
  Spin,
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
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
              onClick={() => navigate(`/employee/edit/${employeeId}`)}
              icon={<EditFilled />}
            >
              Cập nhật hồ sơ
            </Button>
          </Col>
        </Row>
        <Content style={{ background: colorBgContainer, padding: 20 }}>
          <Skeleton avatar loading={loading} active={loading}>
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
          </Skeleton>
        </Content>
      </Space>
    </Spin>
  );
};
