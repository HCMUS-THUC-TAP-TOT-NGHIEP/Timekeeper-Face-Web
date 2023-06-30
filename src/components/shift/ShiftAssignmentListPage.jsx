import {
  DeleteOutlined,
  EditTwoTone,
  EyeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Col,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { DeleteShiftAssignment, GetAssignmentList } from "./api";
import { useAuthState } from "../../Contexts/AuthContext";
import Search from "antd/es/input/Search";
import { compareString } from "../../utils/Comparation";

const ShiftAssignmentListPage = (props) => {
  const { notify } = props;
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const searchInputRef = useRef();
  const { authorization } = useAuthState();

  const [shiftAssignmentList, setShiftAssignmentList] = useState([]);

  useEffect(() => {
    document.title = "Danh mục bảng phân ca chi tiết";
  }, []);

  useEffect(() => {
    setLoading(true);
    let SearchString = searchInputRef.current
      ? searchInputRef.current.input.value
      : "";
    GetAssignmentList({ Page: page, PageSize: pageSize, SearchString })
      .then((response) => {
        const { Status, ResponseData, Description } = response;
        if (Status === 1) {
          const { ShiftAssignmentList, Total } = ResponseData;
          setShiftAssignmentList(ShiftAssignmentList);
          setTotal(Total);
          return;
        }
        throw new Error(Description);
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, pageSize, reloading]);

  const deleteOnFE = function (value) {
    var newList = shiftAssignmentList.filter(
      (element) => element.Id !== value.Id
    );
    setShiftAssignmentList(newList);
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
              onClick={() => navigate("/shift/assignment/new")}
              icon={<PlusOutlined />}
            >
              Phân ca
            </Button>
          </Space>
        </Col>
      </Row>
      <Content style={{ paddingTop: 10 }}>
        <Row
          wrap={true}
          gutter={[16, 16]}
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col flex="none" style={{ width: 400 }}>
            <Search
              allowClear
              ref={searchInputRef}
              onSearch={(value) => {
                setReloading(!reloading);
              }}
              enterButton
              placeholder="Tìm kiếm bằng username, email"
            ></Search>
          </Col>
          <Col flex="auto" style={{ textAlign: "right" }}>
            <Space wrap>
              <Button
                loading={loading}
                onClick={() => setReloading(!reloading)}
                style={{
                  backgroundColor: "#ec5504",
                  border: "1px solid #ec5504",
                }}
                type="primary"
                icon={
                  <FontAwesomeIcon
                    icon={faArrowsRotate}
                    style={{ paddingRight: "8px" }}
                  />
                }
              >
                Tải lại
              </Button>
            </Space>
          </Col>
        </Row>
        <Table
          className="boxShadow0 rounded"
          loading={loading}
          scroll={{
            x: 1500,
            y: 1200,
          }}
          dataSource={shiftAssignmentList}
          bordered
          rowKey="Id"
          pagination={{
            page: page,
            pageSize: pageSize,
            total: total,
            showTotal: (total) => `Tổng ${total} bản ghi`,
            showSizeChanger: true,
            onShowSizeChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        >
          <Column
            title="Stt"
            width={60}
            align="right"
            render={(_, record, index) => index + 1}
            fixed="left"
          />
          <Column
            title="Tên bảng phân ca"
            dataIndex="Description"
            width={300}
            render={(_, record) => (
              <NavLink to={`/shift/assignment/detail/${record.Id}`}>
                {record.Description}
              </NavLink>
            )}
            fixed="left"
            sorter={(a, b) => compareString(a.Description, b.Description)}
          />
          <Column
            title="Ca làm việc"
            dataIndex="ShiftName"
            width={200}
            sorter={(a, b) => compareString(a.ShiftName, b.ShiftName)}
          />
          <Column
            title="Thời gian áp dụng"
            align="center"
            render={(_, record) =>
              `${dayjs(record.StartDate).format(Config.DateFormat)} - ${dayjs(
                record.EndDate
              ).format(Config.DateFormat)}`
            }
            width={200}
          />
          <Column
            title="Phòng ban áp dụng"
            // render={(_, record) => (record.DepartmentList || []).join("; ")}
            render={(_, record) => {
              if ((record.DepartmentList || []).length < 5) {
                return (record.DepartmentList || []).join("; ");
              }
              return [...record.DepartmentList, "..."].join("; ");
            }}
            width={300}
          />
          <Column
            title="Nhân viên áp dụng"
            // render={(_, record) => (record.EmployeeList || []).join("; ")}
            render={(_, record) => {
              if ((record.EmployeeList || []).length < 5) {
                return (record.EmployeeList || []).join("; ");
              }
              return [...record.EmployeeList, "..."].join("; ");
            }}
            width={300}
          />
          <Column
            render={(_, record) => (
              <ActionMenu
                shiftAssignment={record}
                deleteOnFE={deleteOnFE}
                notify={notify}
              />
            )}
            fixed="right"
            align="center"
            width={80}
          />
        </Table>
      </Content>
    </Space>
  );
};

const ActionMenu = (props) => {
  const { shiftAssignment, deleteOnFE, notify } = props;
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const onDeletingShiftAssignment = async function () {
    try {
      setDeleting(true);
      var response = await DeleteShiftAssignment({ Id: shiftAssignment.Id });
      if (response.Status != 1) {
        throw new Error(response.Description);
      }
      deleteOnFE(shiftAssignment);
      notify.success({
        message: <b>Thành công</b>,
        description: (
          <p>
            Đã xóa bảng phân ca <b>{shiftAssignment.Description}</b>
          </p>
        ),
      });
    } catch (error) {
      handleErrorOfRequest({ notify, error });
    } finally {
      setDeleting(false);
    }
  };
  return (
    <Space size="small">
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
        okButtonProps={{ loading: deleting }}
        onConfirm={onDeletingShiftAssignment}
      >
        <Tooltip title="Xoá">
          <Button
            size="small"
            icon={<DeleteOutlined />}
            type="text"
            shape="circle"
            danger
          />
        </Tooltip>
      </Popconfirm>
    </Space>
  );
};

export { ShiftAssignmentListPage };
