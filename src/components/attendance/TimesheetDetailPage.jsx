import {
  ExportOutlined,
  UndoOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  faArrowLeft,
  faArrowsRotate,
  faCalendarDays,
  faFileExport,
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
import { handleErrorOfRequest } from "../../utils/Helpers";
import { defaultColumns } from "../employee";
import { CustomStatisticsComponent } from "./CustomStatisticsComponent";
import {
  ExportTimesheetBE,
  GetTimesheetDetail,
  UpdateTimesheetBE,
} from "./api";
import fileDownload from 'js-file-download'
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

const lateEarlyColumns = [
  {
    key: "late",
    title: "Số phút đi trễ",
    dataIndex: "LateMinutes",
    width: 100,
    align: "right",
  },
  {
    key: "early",
    title: "Số phút về sớm",
    dataIndex: "EarlyMinutes",
    width: 100,
    align: "right",
  },
  {
    key: "count",
    title: "Số lần đi trễ về sớm",
    dataIndex: "Count",
    width: 100,
    align: "right",
  },
];

const noTimekeepingColumns = [
  {
    key: "count",
    title: "Số lần không chấm công",
    dataIndex: "noTimekeeping",
    width: 100,
    align: "right",
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
  const [lateEarly, setLatEarly] = useState([]);
  const [lateEarlyList, setLateEarlyList] = useState([]);
  const [noTimekeeping, setToTimekeeping] = useState(0);
  const [columns, setColumns] = useState([]);
  const [reloading, setReloading] = useState(false);
  const [processing, setProcessing] = useState(false);

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
        handleErrorOfRequest({ notify, error });
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
          width: 250,
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

  useEffect(() => {
    try {
      let employeeId = [];
      let LateEarlyList = [];
      let noTimekeeping = [];
      detailRecord.forEach((rec) => {
        if ((rec.LateMinutes || 0) > 0 || (rec.EarlyMinutes || 0) > 0) {
          let index = employeeId.indexOf(rec.EmployeeId);
          if (index == -1) {
            employeeId.push(rec.EmployeeId);
            LateEarlyList.push({
              Id: rec.EmployeeId,
              EmployeeName: rec.EmployeeName,
              Department: rec.Department,
              Count: 1,
              LateMinutes: rec.LateMinutes > 0 ? rec.LateMinutes : 0,
              EarlyMinutes: rec.EarlyMinutes > 0 ? rec.EarlyMinutes : 0,
            });
          } else {
            LateEarlyList[index].Count++;
            LateEarlyList[index].LateMinutes +=
              rec.LateMinutes > 0 ? rec.LateMinutes : 0;
            LateEarlyList[index].EarlyMinutes +=
              rec.EarlyMinutes > 0 ? rec.EarlyMinutes : 0;
          }
        }
      });
      setLateEarlyList(LateEarlyList);
    } catch (error) {
      handleErrorOfRequest({ error, notify });
    } finally {
    }
  }, [detailRecord]);

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
          Checkin: (
            <>
              <p style={{ margin: "unset" }}>{record.ShiftName}</p>
              <p style={{ margin: "unset" }}>{`${
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
              }`}</p>
            </>
          ),
        };
      }
    } catch (error) {
      handleErrorOfRequest({ notify, error });
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
    } finally {
      setLoading(false);
    }
  };

  const exportTimesheetReport = async () => {
    var url;
    try {
      setProcessing(true);
      var fileData = await ExportTimesheetBE({ Id: timeSheet.Id });
      // url = URL.createObjectURL(fileData
      //   // new Blob(fileData, {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      // );
      // var link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download", timeSheet.Name);
      // document.body.appendChild(link);
      // link.click();
      // link.parentNode.removeChild(link);
      fileDownload(new Blob([fileData]), timeSheet.Name,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" )
    } catch (error) {
      handleErrorOfRequest({ error, notify });
      console.error(error);
    } finally {
      setProcessing(false);
      if ((url || "").length > 0) URL.revokeObjectURL(url);
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical" wrap>
            <Space direction="horizontal" align="center" wrap>
              <Tooltip title="Quay lại">
                <Button
                  onClick={() => navigate(-1)}
                  icon={<FontAwesomeIcon icon={faArrowLeft} fontSize={28} />}
                  type="text"
                  shape="circle"
                  // style={{padding: 0}}
                  size="large"
                />
              </Tooltip>
              <Typography.Title
                level={2}
                style={{ marginTop: 0, marginBottom: 0, maxWidth: "100%" }}
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
          </Space>
        </Col>
      </Row>
      <Row wrap gutter={[16, 16]}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <NavLink to="/">Dashboard</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <NavLink to="">Bảng chấm công chi tiết</NavLink>
            </Breadcrumb.Item>
          </Breadcrumb>
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
              Import
            </Button>
          </Space>
        </Col>
      </Row>
      <Row wrap gutter={[16, 16]}>
        <Col span={6}>
          <CustomStatisticsComponent
            key="late-early-employee"
            cols={lateEarlyColumns}
            dataSrc={lateEarlyList || []}
            title="Đi trễ về sớm"
            total={(lateEarlyList || []).length}
            modalTitle={
              <span style={{ fontSize: 20 }}>
                Danh sách nhân viên Đi trễ về sớm
              </span>
            }
            icon={<FontAwesomeIcon icon={faCalendarDays} />}
          />
        </Col>
        <Col span={6}>
          <CustomStatisticsComponent
            key="invalid-record"
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
      <Row wrap gutter={[16, 16]}>
        {/* <Col flex="none">
          <Search
            placeholder="Tìm kiếm"
            allowClear={true}
            loading={searching}
            enterButton
          />
        </Col> */}
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space>
            <Tooltip title="Tải lại">
              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faArrowsRotate} />}
                loading={loading}
                onClick={() => setReloading(!reloading)}
              />
            </Tooltip>
            <Tooltip title="Xuất bảng chấm công" placement="rightTop">
              <Button
                type="default"
                icon={<FontAwesomeIcon icon={faFileExport} />}
                onClick={exportTimesheetReport}
                loading={processing}
              />
            </Tooltip>
          </Space>
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
