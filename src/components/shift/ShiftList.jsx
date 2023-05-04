import {
  DeleteFilled,
  DeleteOutlined,
  FilterFilled,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Input,
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
import Highlighter from "react-highlight-words";
import { NavLink, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { compareDatetime, compareString } from "../../utils/Comparation";
import { AddShift } from "./AddShift";
import { EditShift } from "./EditShift";
import { DeleteShift, GetShiftList } from "./api";

const ShiftList = function (props) {
  const [loading, setLoading] = useState(true);
  const [currentShiftList, setCurrentShiftList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { notify } = props;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Ca làm việc";
  }, []);
  useEffect(() => {
    GetShiftList()
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          setCurrentShiftList(ResponseData);
          return;
        }
        notify.error({
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
      .finally(() => {
        setLoading(false);
      });
  }, [perPage, page, notify]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterFilled
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(
          () => (searchInput.current ? searchInput.current.input : undefined),
          100
        );
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
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
  const insertOneShift = (value) => {
    value.Status = 1;
    if (currentShiftList.length < perPage)
      setCurrentShiftList([...currentShiftList, value]);
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
              Ca làm việc
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
          <Space>
            <AddShift
              insertOneShiftFE={insertOneShift}
              notify={notify}
              currentShiftList={currentShiftList}
            />
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
        <Table
          loading={loading}
          bordered
          scroll={{
            x: 900,
          }}
          style={{ borderColor: "black" }}
          dataSource={currentShiftList}
          rowKey="Id"
        >
          <Column
            title="Mô tả"
            dataIndex="Description"
            key="Description"
            sorter={(a, b) => compareString(a, b, "Description")}
            {...getColumnSearchProps("Description")}
            width={200}
          />
          <Column
            title="Loại ca"
            dataIndex="ShiftTypeText"
            key="ShiftTypeText"
            sorter={(a, b) => compareString(a, b, "ShiftTypeText")}
            {...getColumnSearchProps("ShiftTypeText")}
            width={200}
          />
          <Column
            title="Ngày bắt đầu"
            dataIndex="StartDate"
            key="StartDate"
            {...getColumnSearchProps("StartDate")}
            render={(_, { StartDate }) => {
              var content = "";
              if (StartDate) {
                content += dayjs(StartDate).format(Config.DateFormat);
              }
              return <Typography.Text>{content}</Typography.Text>;
            }}
            sorter={(a, b) => compareDatetime(a, b, "StartDate")}
            width={250}
          />
          <Column
            title="Ngày kết thúc"
            dataIndex="EndDate"
            key="EndDate"
            {...getColumnSearchProps("StartDate")}
            render={(_, { EndDate }) => {
              var content = "";
              if (EndDate) {
                content += dayjs(EndDate).format(Config.DateFormat);
              }
              return <Typography.Text>{content}</Typography.Text>;
            }}
            sorter={(a, b) => compareDatetime(a, b, "EndDate")}
            width={250}
          />
          <Column
            title="Giờ vào"
            dataIndex="StartTime"
            key="StartTime"
            sorter={(a, b) => compareDatetime(a, b, "StartTime")}
            {...getColumnSearchProps("StartTime")}
            render={(_, record) => {
              if (record.StartTime) {
                var time = dayjs(record.StartTime, Config.TimeFormat);
                return <p>{time.format(Config.NonSecondFormat)}</p>;
              }
              return <p></p>;
            }}
            width={150}
          />
          <Column
            title="Giờ ra"
            dataIndex="FinishTime"
            key="FinishTime"
            sorter={(a, b) => compareDatetime(a, b, "FinishTime")}
            {...getColumnSearchProps("FinishTime")}
            render={(_, record) => {
              if (record.FinishTime) {
                var time = dayjs(record.FinishTime, Config.TimeFormat);
                return <p>{time.format(Config.NonSecondFormat)}</p>;
              }
              return <p></p>;
            }}
            width={150}
          />
          <Column
            title="Giờ nghỉ"
            dataIndex="Break"
            key="Break"
            render={(_, shift) => {
              var content = "";
              if (shift.BreakAt) {
                content += dayjs(shift.BreakAt, Config.TimeFormat).format(
                  Config.NonSecondFormat
                );
              }
              if (shift.BreakEnd) {
                content +=
                  " - " +
                  dayjs(shift.BreakEnd, Config.TimeFormat).format(
                    Config.NonSecondFormat
                  );
              }
              return <Typography.Text>{content}</Typography.Text>;
            }}
            width={250}
          />
          <Column
            title="Số giờ làm"
            dataIndex="Số giờ làm"
            key="Số giờ làm"
            render={(_, record) => {
              var minutes = 0;
              if (record.StartTime && record.FinishTime) {
                var time0 = dayjs(record.StartTime, Config.TimeFormat);
                var time1 = dayjs(record.FinishTime, Config.TimeFormat);
                if (record.BreakAt && record.BreakEnd) {
                  var time2 = dayjs(record.BreakAt, Config.TimeFormat);
                  var time3 = dayjs(record.BreakEnd, Config.TimeFormat);
                  minutes =
                    time1.diff(time0, "minutes") - time3.diff(time2, "minutes");
                } else {
                  minutes = time1.diff(time0, "minutes");
                }
              }
              return `${(minutes - (minutes % 60)) / 60} giờ ${
                minutes % 60
              } phút`;
            }}
            width={250}
          />
          <Column
            title="Trạng thái"
            dataIndex="Status"
            key="Status"
            width={200}
            render={(_, record) => {
              var content = "";
              if (record.Status) {
                content = "In use";
              }
              return <Tag color="geekblue">{content}</Tag>;
            }}
          />
          <Column
            title=""
            dataIndex="actions"
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
            width={250}
          />
        </Table>
      </Content>
    </Space>
  );
};

function ActionMenu(props) {
  const { shift, setShiftList, shiftList, updateOneShift } = props;
  const [notify, contextHolder] = notification.useNotification();

  return (
    <Space align="center" size="middle" wrap>
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
        <Button type="text" shape="circle" icon={<DeleteOutlined />} danger />
      </Tooltip>
    </Popconfirm>
  );
};

export { ShiftList };
