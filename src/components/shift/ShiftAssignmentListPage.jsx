import {
  DeleteOutlined,
  EditTwoTone,
  EyeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Popconfirm,
  Row,
  Space,
  Table,
  Tabs,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { compareString } from "../../utils/Comparation";
import { GetAssignmentList } from "./api";
import Column from "antd/es/table/Column";

const ShiftAssignmentListPage = (props) => {
  const { notify } = props;
  const [loading, setLoading] = useState(true);
  const [tabKey, setTabKey] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [shiftAssignmentList, setShiftAssignmentList] = useState([]);
  const [fullShiftAssignmentList, setFullShiftAssignmentList] = useState([]);

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "Description",
      key: "Description",
      width: 200,
      sorter: (a, b) => compareString(a, b, "Description"),
    },
    {
      title: "Ca",
      dataIndex: "ShiftDescription",
      key: "ShiftDescription",
      width: 100,
      sorter: (a, b) => compareString(a, b, "ShiftDescription"),
    },
    {
      title: "Từ ngày",
      dataIndex: "StartDate",
      key: "StartDate",
      width: 100,
      sorter: (a, b) => compareString(a, b, "StartDate"),
      render: (_, { StartDate }) => dayjs(StartDate).format(Config.DateFormat),
    },
    {
      title: "Đến ngày",
      dataIndex: "EndDate",
      key: "EndDate",
      width: 100,
      sorter: (a, b) => compareString(a, b, "EndDate"),
      render: (_, { EndDate }) => dayjs(EndDate).format(Config.DateFormat),
    },
    {
      title: "Ngày tạo",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      width: 100,
      render: (_, { CreatedDate }) =>
        dayjs(CreatedDate).format(Config.DateFormat),
      sorter: (a, b) => compareString(a, b, "CreatedDate"),
    },
    {
      title: "",
      dataIndex: "",
      key: "Action",
      width: 30,
      render: (_, shiftAssignment) => (
        <ActionMenu shiftAssignment={shiftAssignment} />
      ),
    },
  ];

  useEffect(() => {
    GetAssignmentList()
      .then((response) => {
        const { Status, ResponseData, Description } = response;
        if (Status === 1) {
          console.log(ResponseData)
          const { ShiftAssignmentList, Total } = ResponseData;
          setShiftAssignmentList(ShiftAssignmentList);
          setTotal(Total);
          return;
        }
        notify.error({
          message: "Có lỗi",
          description: Description,
        });
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
      .finally((done) => {
        setLoading(false);
      });
  }, []);
  const changeTabs = (activeKey) => {
    setTabKey(activeKey);
    if (activeKey == 0) {
      setShiftAssignmentList(fullShiftAssignmentList);
    } else {
      setShiftAssignmentList(
        fullShiftAssignmentList.filter((a) => a.AssignType == activeKey)
      );
    }
  };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Phân ca chi tiết
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/shift">Ca làm việc</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="">Phân ca chi tiết</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space wrap>
            <Button
              type="primary"
              onClick={() => navigate("/shift/assignment")}
              icon={<PlusOutlined />}
            >
              Phân ca
            </Button>
          </Space>
        </Col>
      </Row>
      <Content>
        <Table
          loading={loading}
          scroll={{
            x: 1500,
          }}
          rowSelection={{
            type: "checkbox",
            onSelect: (record) => navigate(`/shift/assignment/detail/${record.Id}`),
          }}
          dataSource={shiftAssignmentList}
          bordered
          rowKey="Id"
          pagination={{
            total: total,
            showTotal: (total, _) => `Tổng ${total} bản ghi`,
            onShowSizeChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        >
          <Column
            title="Tên bảng phân ca"
            dataIndex="Description"
            width={200}
          />
          <Column title="Ca làm việc" dataIndex="ShiftName" width={200} />
          <Column
            title="Thời gian áp dụng"
            render={(_, record) =>
              `${dayjs(record.StartDate).format(Config.DateFormat)} - ${dayjs(
                record.EndDate
              ).format(Config.DateFormat)}`
            }
            width={200}
          />
          <Column
            title="Phòng ban áp dụng"
            render={(_, record) => record.DepartmentList.join("; ")}
            width={300}
          />
          <Column
            title="Nhân viên áp dụng"
            render={(_, record) => record.EmployeeList.join("; ")}
            width={300}
          />
          <Column render={(_,record) => <ActionMenu shiftAssignment={record} />}/>
        </Table>
      </Content>
    </Space>
  );
};

const ActionMenu = (props) => {
  const { shiftAssignment } = props;
  const navigate = useNavigate();
  return (
    <Space>
      <Tooltip title="Xem nhanh">
        <Button
          onClick={() =>
            navigate(`/shift/assignment/detail/${shiftAssignment.Id}`)
          }
          type="text"
          shape="circle"
          icon={<EyeTwoTone />}
        />
      </Tooltip>
      <Tooltip title="Chỉnh sửa">
        <Button
          onClick={() =>
            navigate(`/shift/assignment/edit/${shiftAssignment.Id}`)
          }
          type="text"
          shape="circle"
          icon={<EditTwoTone />}
        />
      </Tooltip>
      <Popconfirm
        title={`Xóa phân ca`}
        description={`Bạn có chắc muốn xóa phân ca ${shiftAssignment.Description}?`}
        okText="Chắc chắn"
        cancelText="Hủy"
        okType="danger"
        placement="top"
        //   onConfirm={deleteDepartment}
      >
        <Tooltip title="Xoá">
          <Button icon={<DeleteOutlined />} type="text" shape="circle" danger />
        </Tooltip>
      </Popconfirm>
    </Space>
  );
};

export { ShiftAssignmentListPage };
