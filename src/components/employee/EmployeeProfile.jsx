import {
  Breadcrumb,
  Button,
  Col, Row,
  Space
} from "antd";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const EmployeeProfile = (props) => {

  useEffect(() => {
    document.title = "Tất cả nhân viên";
  }, []);


  return (
    <Space direction="vertical">
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/employee/all">Nhân viên</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/employee/all">Tất cả</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button type="primary">Thêm nhân viên mới</Button>
        </Col>
      </Row>

    </Space>
  );
};

