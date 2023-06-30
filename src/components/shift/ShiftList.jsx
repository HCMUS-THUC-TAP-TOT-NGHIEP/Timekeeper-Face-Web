import { DeleteFilled, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
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
  Tag,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { Content } from "antd/es/layout/layout";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { compareDatetime, compareString } from "../../utils/Comparation";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { EditShift } from "./EditShift";
import { DeleteShift, GetShiftList } from "./api";
import Search from "antd/es/input/Search";

function ActionMenu(props) {
  const { shift, setShiftList, shiftList, updateOneShift } = props;
  const [notify, contextHolder] = notification.useNotification();

  return (
    <Space align="center" size="small" wrap>
      {contextHolder}
      <EditShift
        notify={notify}
        updateOneShift={updateOneShift}
        shiftList={shiftList}
        shift={shift}
      />
      <DeleteShiftComponent
        shift={shift}
        notify={notify}
        setShiftList={setShiftList}
        shiftList={shiftList}
      />
    </Space>
  );
}

const DeleteShiftComponent = (props) => {
  const { shift, notify, setShiftList, shiftList } = props;
  const deleteShift = () => {
    DeleteShift({ IdList: [shift.Id] })
      .then((response) => {
        const { Status, Description } = response;
        if (Status === 1) {
          notification.success({
            description: `Đã xóa ${shift.Id} - ${shift.Description}`,
          });
          setShiftList(shiftList.filter((a) => a.Id !== shift.Id));
          return;
        }
        notification.error({
          message: "Không thành công",
          description: Description,
        });
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      });
  };
  return (
    <Popconfirm
      title={`Xóa ca làm việc ID ${shift.Id}`}
      description={`Bạn có chắc muốn xóa ID ${shift.Id} - ${shift.Description}?`}
      okText="Xóa"
      okType="danger"
      cancelText="Hủy"
      placement="topLeft"
      onConfirm={deleteShift}
      icon={<DeleteFilled />}
    >
      <Tooltip title="Xóa">
        <Button
          size="small"
          type="text"
          shape="circle"
          icon={<DeleteOutlined />}
          danger
        />
      </Tooltip>
    </Popconfirm>
  );
};

const ShiftList = function ({ notify, ...rest }) {
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(true);
  const [currentShiftList, setCurrentShiftList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const searchInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    let SearchString = searchInputRef.current
      ? searchInputRef.current.input.value
      : "";
    setLoading(true);
    GetShiftList({ Page: page, PerPage: perPage, SearchString })
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          const { ShiftList, Total } = ResponseData;
          setTotalPages(Total);
          setCurrentShiftList(ShiftList);
          return;
        }
        notify.error({
          description: Description,
        });
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [perPage, page, notify, reloading]);

  const updateOneShift = (value) => {
    const newCurrentShiftList = currentShiftList.map((shift) => {
      if (shift.Id === value.Id) {
        value.key = value.Id;
        return value;
      } else {
        return shift;
      }
    });
    setCurrentShiftList(newCurrentShiftList);
  };

  const deleteOneShift = (value) => {
    setCurrentShiftList(
      currentShiftList.filter((shift) => shift.Id !== value.Id)
    );
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Danh mục ca làm việc
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <NavLink to="">Dashboard</NavLink>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <NavLink to="">Ca làm việc</NavLink>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space wrap>
            <Button
              type="primary"
              onClick={() => navigate("/shift/add")}
              icon={<PlusOutlined />}
            >
              Thêm
            </Button>
            <Button
              type="primary"
              onClick={() => navigate("/shift/assignment")}
            >
              Phân ca làm việc
            </Button>
          </Space>
        </Col>
      </Row>
      <Content>
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
          bordered
          scroll={{
            x: 1000,
            y: 1000,
          }}
          pagination={{
            total: totalPages,
            pageSize: perPage,
            page: page,
            showSizeChanger: true,
            showTotal: (total, _) => `Tổng ${total} bản ghi`,
            onShowSizeChange: (page, pageSize) => {
              setPage(page);
              setPerPage(pageSize);
            },
            pageSizeOptions: [10, 20, 50],
          }}
          dataSource={currentShiftList}
          rowKey="Id"
        >
          <Column
            title="Stt"
            width={60}
            align="right"
            render={(_, record, index) => index + 1}
            fixed="left"
          />
          <Column
            title="Mã ca"
            dataIndex="Id"
            key="Id"
            sorter={(a, b) => a.Id > b.Id}
            width={100}
            fixed="left"
          />

          <Column
            title="Tên ca"
            key="Description"
            sorter={(a, b) => compareString(a, b, "Description")}
            render={(_, record) => (
              <NavLink to={`/shift/detail/${record.Id}`}>
                {record.Description}{" "}
              </NavLink>
            )}
            width={250}
            fixed="left"
          />
          <Column
            title="Giờ bắt đầu ca"
            dataIndex="StartTime"
            key="StartTime"
            sorter={(a, b) => compareDatetime(a, b, "StartTime")}
            render={(_, record) =>
              record.StartTime
                ? dayjs(record.StartTime, Config.TimeFormat).format(
                    Config.NonSecondFormat
                  )
                : ""
            }
            width={200}
            align="center"
          />
          <Column
            title="Giờ kết thúc ca"
            dataIndex="FinishTime"
            key="FinishTime"
            sorter={(a, b) => compareDatetime(a, b, "FinishTime")}
            render={(_, record) =>
              record.FinishTime
                ? dayjs(record.FinishTime, Config.TimeFormat).format(
                    Config.NonSecondFormat
                  )
                : ""
            }
            width={200}
            align="center"
          />
          <Column
            title="Giờ bắt đầu nghỉ giữa ca"
            dataIndex="BreakAt"
            key="BreakAt"
            sorter={(a, b) => compareDatetime(a, b, "BreakAt")}
            render={(_, record) =>
              record.BreakAt
                ? dayjs(record.BreakAt, Config.TimeFormat).format(
                    Config.NonSecondFormat
                  )
                : ""
            }
            width={250}
            align="center"
          />
          <Column
            title="Giờ kết thúc nghỉ giữa ca"
            dataIndex="BreakEnd"
            key="BreakEnd"
            sorter={(a, b) => compareDatetime(a, b, "BreakEnd")}
            render={(_, record) =>
              record.BreakEnd
                ? dayjs(record.BreakEnd, Config.TimeFormat).format(
                    Config.NonSecondFormat
                  )
                : ""
            }
            width={250}
            align="center"
          />
          <Column
            title="Ngày công"
            dataIndex="WorkingDay"
            key="WorkingDay"
            sorter={(a, b) => a.WorkingDay > b.WorkingDay}
            width={200}
            align="right"
          />
          <Column
            title="Giờ công"
            dataIndex="WorkingHour"
            key="WorkingHour"
            sorter={(a, b) => a.WorkingHour > b.WorkingHour}
            width={200}
            align="right"
          />

          <Column
            title="Trạng thái"
            dataIndex="Status"
            key="Status"
            width={200}
            sorter={(a, b) => a.Status > b.Status}
            render={(_, record) => {
              var content = "";
              if (record.Status) {
                content = "Available";
                return <Tag color="geekblue">{content}</Tag>;
              } else {
                content = "Unavailable";
                return <Tag color="orange">{content}</Tag>;
              }
            }}
          />
          <Column
            title=""
            key="actions"
            render={(_, record) => (
              <ActionMenu
                shift={record}
                setShiftList={setCurrentShiftList}
                shiftList={currentShiftList}
                updateOneShift={updateOneShift}
                deleteOneShift={deleteOneShift}
              />
            )}
            align="center"
            width={100}
            fixed="right"
          />
        </Table>
      </Content>
    </Space>
  );
};

export { ShiftList };
