import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  UndoOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  faCalendarDays,
  faCalendarXmark,
  faCheckToSlot,
  faClock,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import Search from "antd/es/input/Search";
import TextArea from "antd/es/input/TextArea";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import Config from "../../constant";
import { GetTimesheetDetail } from "./api";
import Column from "antd/es/table/Column";
import CountUp from "react-countup";
import { CustomStatisticsComponent } from "./CustomStatisticsComponent";
const formatter = (value) => <CountUp end={value} separator="," />;
dayjs.extend(isSameOrBefore);


let defaultCols = [
  {
    key: "code",
    dataIndex: "EmployeeId",
    title: "Mã nhân viên",
    width: 100,
  },
  {
    key: "name",
    title: "Nhân viên",
    dataIndex: "EmployeeName",
    width: 300,
  },
];

let colsStatics = [...defaultCols]

const TimesheetDetailPage = ({ notify, loginRequired, ...rest }) => {
  const userDetails = useAuthState();
  const navigate = useNavigate();
  const { TimesheetId } = useParams();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searching, setSearching] = useState(false);

  const [timeSheet, setTimeSheet] = useState({});
  const [detailRecord, settDetailRecord] = useState([]);
  const [DateRange, setDateRange] = useState([]);
  const [clockedIn, setClockedIn] = useState(0);
  const [offNumber, setOffNumber] = useState(0);
  const [lateEarly, setLatEarly] = useState(0);
  const [noTimekeeping, setToTimekeeping] = useState(0);
  const [columns, setColumns] = useState([]);

  const search = async (value) => {
    setSearching(true);
    console.log(value);
  };

  useEffect(() => {
    async function LoadData() {
      try {
        setLoading(true);
        var response = await GetTimesheetDetail({ Id: TimesheetId });
        console.log(response);
        if (response.Status === 1) {
          var { Timesheet, Detail, Total } = response.ResponseData;
          setTimeSheet(Timesheet);
          setTotal(Total);
          settDetailRecord(Detail);
          setDateRange([Timesheet.DateFrom, Timesheet.DateTo]);
          // if ((timeSheet || {}).DateFrom && (timeSheet || {}).DateTo) {
          // }
          createColumns(Timesheet.DateFrom, Timesheet.DateTo);
          return;
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    function createColumns(DateFrom, DateTo) {
      let start = dayjs(DateFrom);
      let end = dayjs(DateTo);
      var cols = defaultCols;
      while (!start.isAfter(end, "day")) {
        var col = {
          key: start.format("YYYY-MM-DD"),
          title: (
            <Space
              direction="vertical"
              align="middle"
              size={"small"}
              style={{ textAlign: "center" }}
            >
              <div style={{ textTransform: "capitalize" }}>
                {start.locale("vi").format("dddd")}
              </div>
              <div>{start.format(Config.DateFormat)}</div>
            </Space>
          ),
          width: 150,
          dataIndex: [start.format("YYYY-MM-DD"), "Checkin"],
          // render: (_, record) => {
          //   return JSON.stringify(record[start.format("YYYY-MM-DD")])
          // },
        };
        cols.push(col);
        start = start.add(1, "day");
      }
      setColumns(cols);
      return cols;
    }
    LoadData();
  }, [TimesheetId]);

  const dataSrc = [];
  const employeeId = [];
  for (const record of detailRecord) {
    try {
      var index = employeeId.indexOf(record.EmployeeId);
      if (index == -1) {
        var temp = {
          EmployeeId: record.EmployeeId,
          EmployeeName: record.EmployeeName,
        };
        temp[`${record.Date}`] = {
          Checkin: `${
            record.CheckinTime
              ? dayjs(record.CheckinTime, Config.TimeFormat).format(
                  Config.NonSecondFormat
                )
              : "-:-"
          } - ${
            record.CheckoutTime
              ? dayjs(record.CheckoutTime, Config.TimeFormat).format(
                  Config.NonSecondFormat
                )
              : "-:-"
          }`,
        };
        employeeId.push(record.EmployeeId);
        dataSrc.push(temp);
      } else {
        dataSrc[index][`${record.Date}`] = {
          Checkin: `${
            record.CheckinTime
              ? dayjs(record.CheckinTime, Config.TimeFormat).format(
                  Config.NonSecondFormat
                )
              : "-:-"
          } - ${
            record.CheckoutTime
              ? dayjs(record.CheckoutTime, Config.TimeFormat).format(
                  Config.NonSecondFormat
                )
              : "-:-"
          }`,
        };
      }
    } catch (error) {
      console.error(error);
    } finally {
      // console.log(dataSrc);
      // console.log(columns);
    }
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical" wrap>
            <Space direction="horizontal" align="center" wrap>
              <Typography.Title
                level={2}
                style={{ marginTop: 0, maxWidth: "100%" }}
              >
                {timeSheet.Name}
              </Typography.Title>
              {timeSheet.LockedStatus ? (
                <Tag
                  icon={
                    <FontAwesomeIcon
                      icon={faLock}
                      style={{ paddingRight: "8px" }}
                    />
                  }
                >
                  Đã khóa
                </Tag>
              ) : (
                <Tag
                  icon={
                    <FontAwesomeIcon
                      icon={faLockOpen}
                      style={{ paddingRight: "8px" }}
                    />
                  }
                >
                  Chưa khóa
                </Tag>
              )}
            </Space>
            <Breadcrumb>
              <Breadcrumb.Item>
                <NavLink to="/">Dashboard</NavLink>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <NavLink to="">Bảng chấm công chi tiết</NavLink>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space wrap>
            <Button type="primary" icon={<UndoOutlined />} loading={loading}>
              Cập nhật
            </Button>

            <Button type="default" icon={<UploadOutlined />}>
              Nhập khẩu
            </Button>
          </Space>
        </Col>
      </Row>
      <Row wrap gutter={[16, 16]}>
        <Col span={6}>
          <CustomStatisticsComponent
            key="off-employee"
            cols={colsStatics}
            dataSrc={[]}
            title="Đi làm"
            total={10}
            modalTitle="Danh sách nhân viên"
            icon={<FontAwesomeIcon icon={faCheckToSlot} />}
          />
          <Card bordered={false} size="small">
            <Statistic
              valueStyle={{
                fontSize: "14px",
                display: "flex",
                justifyContent: "space-between",
              }}
              value={clockedIn}
              prefix={
                <Space>
                  <FontAwesomeIcon icon={faCheckToSlot} />
                  Đi làm
                </Space>
              }
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} size="small">
            <Statistic
              valueStyle={{
                fontSize: "14px",
                display: "flex",
                justifyContent: "space-between",
              }}
              value={offNumber}
              prefix={
                <Space>
                  <FontAwesomeIcon icon={faCalendarDays} />
                  Nghỉ
                </Space>
              }
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} size="small">
            <Statistic
              valueStyle={{
                fontSize: "14px",
                display: "flex",
                justifyContent: "space-between",
              }}
              value={lateEarly}
              prefix={
                <Space>
                  <FontAwesomeIcon icon={faClock} />
                  Đi trễ về sớm
                </Space>
              }
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} size="small">
            <Statistic
              valueStyle={{
                fontSize: "14px",
                display: "flex",
                justifyContent: "space-between",
              }}
              value={noTimekeeping}
              formatter={formatter}
              prefix={
                <Space>
                  <FontAwesomeIcon icon={faCalendarXmark} />
                  Chưa chấm công
                </Space>
              }
            />
          </Card>
        </Col>
      </Row>
      <Row wrap>
        <Col flex="none">
          <Search
            placeholder="Tìm kiếm"
            allowClear={true}
            loading={searching}
            enterButton
          />
          <Col flex="auto" style={{ textAlign: "right" }}></Col>
        </Col>
      </Row>
      <Content>
        <Table
          loading={loading}
          className="boxShadow89"
          bordered
          scroll={{
            x: "calc(700px + 50%)",
            y: 1000,
          }}
          rowSelection={{
            type: "checkbox",
          }}
          style={{ borderColor: "black" }}
          dataSource={dataSrc}
          rowKey="EmployeeId"
          locale={locale}
          pagination={{
            total: (dataSrc || []).length,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            showTotal: (total) => `Tổng ${total} mục`,
          }}
          columns={columns}
        ></Table>
      </Content>
    </Space>
  );
};

export { TimesheetDetailPage };
