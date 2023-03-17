import {
  DeleteFilled,
  EditFilled,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Table,
  Tabs,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ShiftAssignmentList = [
  {
    Id: 1,
    Description: "Phân ca tháng 3",
    StartDate: new Date(),
    EndDate: new Date(),
    AssignType: 1,
    CreatedDate: new Date(),
    DepartmentId: [1, 2],
    EmployeeId: [1, 2],
    DesignationId: [1, 2],
    key: 1,
  },
  {
    Id: 2,
    Description: "Phân ca tháng 3",
    StartDate: new Date(),
    EndDate: new Date(),
    AssignType: 2,
    CreatedDate: new Date(),
    DepartmentId: [1, 2],
    EmployeeId: [1, 2],
    DesignationId: [1, 2],
    key: 2,
  },
  {
    Id: 3,
    Description: "Phân ca tháng 3",
    StartDate: new Date(),
    EndDate: new Date(),
    AssignType: 1,
    CreatedDate: new Date(),
    DepartmentId: [1, 2],
    EmployeeId: [1, 2],
    DesignationId: [1, 2],
    key: 3,
  },
];
const datePattern = "DD/MM/YYYY";
const ShiftAssignmentListPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [tabKey, setTabKey] = useState(0);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [shiftAssignmentList, setShiftAssignmentList] = useState(
    ShiftAssignmentList
  );

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "Description",
      key: "Description",
      width: 80,
    },
    {
      title: "Kiểu phân ca",
      dataIndex: "AssignType",
      key: "AssignType",
      width: 80,
    },
    {
      title: "Từ ngày",
      dataIndex: "StartDate",
      key: "StartDate",
      width: 60,
      render: (_, { StartDate }) => dayjs(StartDate).format(datePattern),
    },
    {
      title: "Đến ngày",
      dataIndex: "EndDate",
      key: "EndDate",
      width: 60,
      render: (_, { EndDate }) => dayjs(EndDate).format(datePattern),
    },
    {
      title: "Ngày tạo",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      width: 60,
      render: (_, { CreatedDate }) => dayjs(CreatedDate).format(datePattern),
    },
    {
      title: "",
      dataIndex: "",
      key: "Action",
      width: 10,
      render: (_, shiftAssignment) => (
        <ActionMenu shiftAssignment={shiftAssignment} />
      ),
      fixed: "right",
    },
  ];
  useEffect(() => {
    document.title = "Bảng phân ca";
  }, []);
  const changeTabs = (activeKey) => {
    setTabKey(activeKey);
    if (activeKey == 0) {
      setShiftAssignmentList(ShiftAssignmentList);
    } else {
      setShiftAssignmentList(
        ShiftAssignmentList.filter((a) => a.AssignType == activeKey)
      );
    }
  };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="">Quản lý ca làm việc</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="">Bảng phân ca</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space wrap>
            <Button
              type="primary"
              onClick={() => navigate("/shift/add")}
              icon={<PlusOutlined />}
            >
              Tạo phân ca làm việc mới
            </Button>
          </Space>
        </Col>
      </Row>
      <Tabs
        activeKey={tabKey}
        items={[
          {
            key: 0,
            label: "Tất cả",
          },
          {
            key: 1,
            label: "Phân ca theo phòng ban, vị trí",
          },
          {
            key: 2,
            label: "Phân ca cho cá nhân",
          },
        ]}
        onChange={changeTabs}
      />
      <Content style={{ background: colorBgContainer }}>
        <Skeleton loading={loading} active={loading}>
          <Table
            style={{}}
            scroll={{
              x: 1500,
            }}
            rowSelection={{
              type: "checkbox",
              //   ...rowSelection,
            }}
            dataSource={shiftAssignmentList}
            columns={columns}
          />
        </Skeleton>
      </Content>
    </Space>
  );
};

const ActionMenu = (props) => {
  const { shiftAssignment } = props;
  const items = [
    {
      label: (
        <Space>
          <Link to={`/shift/assignment/detail/${shiftAssignment.Id}`}>
            <EyeOutlined /> Xem nhanh
          </Link>
        </Space>
      ),
      key: "0",
    },

    {
      label: (
        <Space onClick={null}>
          <EditFilled />
          Chỉnh sửa
        </Space>
      ),
      key: "1",
    },
    {
      label: (
        <Popconfirm
          //   title={`Xóa phòng ban ID ${department.Id}`}
          //   description={`Bạn có chắc muốn xóa nhân viên ID ${department.Id} - ${department.Name}?`}
          okText="Yes"
          okType="danger"
          cancelText="No"
          placement="top"
          //   onConfirm={deleteDepartment}
        >
          <a href="#" style={{ display: "block" }}>
            <Space>
              <DeleteFilled key="1" />
              Xóa
            </Space>
          </a>
        </Popconfirm>
      ),
      key: "2",
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
      arrow
    >
      <Space>
        <MoreOutlined />
      </Space>
    </Dropdown>
  );
};
export { ShiftAssignmentListPage };
