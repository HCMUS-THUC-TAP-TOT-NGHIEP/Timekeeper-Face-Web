import { Breadcrumb, Button, Col, Row, Skeleton, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetDepartmentList } from "./api";

const AllDepartmentPage = (props) => {
  const [loading, setLoading] = useState(true);
  const [currentDepartmentList, setCurrentDepartmentList] = useState([]);
  useEffect(() => {
    document.title = "Danh sách phòng ban";
    GetDepartmentList()
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          setCurrentDepartmentList(ResponseData);
          setLoading(false);
          return;
        }
      })
      .catch((error) => {});
  }, []);
  const columns = [
    {
      title: "Mã",
      dataIndex: "Id",
      key: "Id",
      width: 20,
      sorter: (a, b) => a.Id - b.Id,
    },
    {
      title: "Tên",
      dataIndex: "Name",
      key: "Name",
      width: 20,
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      title: "Trưởng phòng",
      dataIndex: "Manager",
      key: "Manager",
      width: 20,
      render: (_, { ManagerId }) => ManagerId,
    },
  ];
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/employee/all">Phòng ban</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/employee/all">Tất cả</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button type="primary">Thêm phòng ban mới</Button>
        </Col>
      </Row>
      <Skeleton loading={loading} active={loading}>
        <Table
          scroll={{
            x: 1500,
          }}
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={currentDepartmentList}
          columns={columns}
        />
      </Skeleton>
    </Space>
  );
};

export { AllDepartmentPage };
