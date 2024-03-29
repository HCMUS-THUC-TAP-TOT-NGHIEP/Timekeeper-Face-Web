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
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { DeleteShiftAssignment, GetAssignmentList } from "./api";
import { handleErrorOfRequest } from "../../utils/Helpers";
import useNotification from "antd/es/notification/useNotification";

const ShiftAssignmentListPage = (props) => {
  const { notify } = props;
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [shiftAssignmentList, setShiftAssignmentList] = useState([]);

  useEffect(() => {
    setLoading(true);
    GetAssignmentList({ Page: page, PageSize: pageSize })
      .then((response) => {
        const { Status, ResponseData, Description } = response;
        if (Status === 1) {
          console.log(ResponseData);
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
        handleErrorOfRequest({ notify, error });
      })
      .finally((done) => {
        setLoading(false);
      });
  }, [page, pageSize, reload]);

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
              onClick={() => setReload(!reload)}
              icon={
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  style={{ paddingRight: "8px" }}
                  spin={loading}
                />
              }
              loading={loading}
              style={{
                backgroundColor: "#ec5504",
                border: "1px solid #ec5504",
              }}
            >
              Lấy lại dữ liệu
            </Button>
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
      <Content>
        <Table
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
            showTotal: (total, _) => `Tổng ${total} bản ghi`,
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
          />
          <Column title="Ca làm việc" dataIndex="ShiftName" width={200} />
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
            render={(_, record) =>
              // (record.DepartmentList || []).length > 0
              //   ? record.DepartmentList.map((element) => element.Name).join(
              //       "; "
              //     )
              //   : ""
              (record.DepartmentList || []).join("; ")
            }
            width={300}
          />
          <Column
            title="Nhân viên áp dụng"
            render={(_, record) =>
              // (record.EmployeeList || []).length > 0
              //   ? record.EmployeeList.map((element) => element.FullName).join(
              //       "; "
              //     )
              //   : ""

              (record.EmployeeList || []).join("; ")
            }
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
      <Tooltip title="Xem nhanh">
        <Button
          onClick={() =>
            navigate(`/shift/assignment/detail/${shiftAssignment.Id}`)
          }
          type="text"
          shape="circle"
          icon={<EyeTwoTone />}
          size="small"
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
