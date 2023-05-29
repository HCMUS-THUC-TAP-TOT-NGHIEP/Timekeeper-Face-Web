import { UndoOutlined, UploadOutlined } from "@ant-design/icons";
import {
  faArrowLeft,
  faCalendarDays,
  faCheckToSlot,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Col,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import Search from "antd/es/input/Search";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import Config from "../../constant";
import { defaultColumns } from "../employee";
import { CustomStatisticsComponent } from "./CustomStatisticsComponent";
import { GetTimesheetDetail, UpdateTimesheetBE } from "./api";
import { handleErrorOfRequest } from "../../utils/Helpers";
const formatter = (value) => <CountUp end={value} separator="," />;
dayjs.extend(isSameOrBefore);

let defaultCols = [
  {
    key: "code",
    title: "Stt",
    width: 60,
    align: "right",
    fixed: "left",
    render: (_, __, index) => index + 1,
  },
  {
    key: "code",
    dataIndex: "EmployeeId",
    title: "Mã NV",
    width: 100,
    align: "right",
    fixed: "left",
    sorter: (a, b) => a.EmployeeId > b.EmployeeId,
  },
  {
    key: "name",
    title: "Nhân viên",
    dataIndex: "EmployeeName",
    width: 250,
    fixed: "left",
  },
];

const TimesheetDetailPage = ({ notify, loginRequired, ...rest }) => {
  const userDetails = useAuthState();
  const navigate = useNavigate();
  const { TimesheetId } = useParams();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searching, setSearching] = useState(false);

  const [timeSheet, setTimeSheet] = useState({});
  const [detailRecord, settDetailRecord] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [clockedIn, setClockedIn] = useState(0);
  const [offNumber, setOffNumber] = useState(0);
  const [lateEarly, setLatEarly] = useState(0);
  const [noTimekeeping, setToTimekeeping] = useState(0);
  const [columns, setColumns] = useState([]);
  const [reloading, setReloading] = useState(false);

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
              style={{
                textAlign: "center",
                color: [0, 6].includes(start.get("day")) ? "red" : "black",
              }}
            >
              <div style={{ textTransform: "capitalize" }}>
                {start.locale("vi").format("dddd")}
              </div>
              <div>{start.format(Config.DateFormat)}</div>
            </Space>
          ),
          width: 150,
          dataIndex: [start.format("YYYY-MM-DD"), "Checkin"],
          align: "center",
        };
        cols.push(col);
        start = start.add(1, "day");
      }
      setColumns(cols);
      return cols;
    }
    LoadData();
  }, [TimesheetId, reloading]);

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

  const updateTimeSheet = async () => {
    try {
      setLoading(true);
      let response = await UpdateTimesheetBE(TimesheetId);
      let { Description, Status } = response;
      if (Status === 1) {
        notify.success({
          message: "Đã cập nhật xong",
        });
        setReloading(!reloading);
        return;
      }
      notify.error({
        message: "Không thể cập nhật",
        description: Description,
      });
      return;
    } catch (error) {
      handleErrorOfRequest({ error: error, notify: notify });
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical" wrap>
            <Space direction="horizontal" align="center" wrap>
            <Tooltip title="Quay lại">
                <Button
                  onClick={() => navigate(-1)}
                  icon={<FontAwesomeIcon icon={faArrowLeft} size="2x" />}
                  type="text"
                  shape="circle"
                />
              </Tooltip>

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
            <Button
              type="primary"
              icon={<UndoOutlined />}
              loading={loading}
              onClick={updateTimeSheet}
            >
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
            cols={defaultColumns}
            dataSrc={[]}
            title="Đi làm"
            total={10}
            modalTitle={
              <span style={{ fontSize: 20 }}>Danh sách nhân viên </span>
            }
            icon={<FontAwesomeIcon icon={faCheckToSlot} />}
          />
        </Col>
        <Col span={6}>
          <CustomStatisticsComponent
            key="off-employee"
            cols={defaultColumns}
            dataSrc={[]}
            title="Nghỉ"
            total={offNumber}
            modalTitle={
              <span style={{ fontSize: 20 }}>Danh sách nhân viên nghỉ </span>
            }
            icon={<FontAwesomeIcon icon={faCalendarDays} />}
          />
        </Col>
        <Col span={6}>
          <CustomStatisticsComponent
            key="off-employee"
            cols={defaultColumns}
            dataSrc={[]}
            title="Đi trễ về sớm"
            total={lateEarly}
            modalTitle={
              <span style={{ fontSize: 20 }}>
                Danh sách nhân viên Đi trễ về sớm{" "}
              </span>
            }
            icon={<FontAwesomeIcon icon={faCalendarDays} />}
          />
        </Col>
        <Col span={6}>
          <CustomStatisticsComponent
            key="off-employee"
            cols={defaultColumns}
            dataSrc={[]}
            title="Chưa chấm công"
            total={lateEarly}
            modalTitle={
              <span style={{ fontSize: 20 }}>
                Danh sách nhân viên chưa chấm công{" "}
              </span>
            }
            icon={<FontAwesomeIcon icon={faCalendarDays} />}
          />
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
            y: 1200,
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
