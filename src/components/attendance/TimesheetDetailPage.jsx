import { DownOutlined, UndoOutlined } from "@ant-design/icons";
import {
  faArrowLeft,
  faArrowsRotate,
  faCalendarDays,
  faCircle,
  faFileExcel,
  faLock,
  faLockOpen,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  TimePicker,
  Tooltip,
  Typography,
  message,
  notification,
  theme,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import Search from "antd/es/input/Search";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import Config from "../../constant";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { defaultColumns } from "../employee";
import { CustomStatisticsComponent } from "./CustomStatisticsComponent";
import { ImportTimesheetData } from "./ImportComponent";
import {
  ExportTimesheetBE,
  GetTimesheetDetail,
  UpdateTimesheetBE,
  UpdateTimesheetDetail,
} from "./api";

dayjs.extend(isSameOrBefore);

let defaultCols = [
  {
    key: "index",
    title: "#",
    width: 50,
    align: "right",
    fixed: "left",
    render: (_, __, index) => index + 1,
  },
  {
    key: "id",
    dataIndex: "EmployeeId",
    title: "Id",
    width: 80,
    align: "right",
    fixed: "left",
    sorter: (a, b) => a.EmployeeId - b.EmployeeId,
  },
  {
    key: "name",
    title: "Nhân viên",
    dataIndex: "EmployeeName",
    width: 200,
    fixed: "left",
  },
];

const lateEarlyColumns = [
  {
    key: "late",
    title: "Số phút đi trễ",
    dataIndex: "LateMinutes",
    render: (value) => value.toFixed(0) || value,
    width: 100,
    align: "right",
  },
  {
    key: "early",
    title: "Số phút về sớm",
    dataIndex: "EarlyMinutes",
    render: (value) => value.toFixed(0) || value,
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
  const [updating, setUpdating] = useState(false);
  const {
    token: { colorBgTextActive, colorWarningActive, colorSuccessActive },
  } = theme.useToken();
  const searchInputRef = useRef();

  useEffect(() => {
    async function LoadData() {
      try {
        setLoading(true);
        let searchString = searchInputRef.current
          ? searchInputRef.current.input.value
          : "";

        var response = await GetTimesheetDetail({
          Id: TimesheetId,
          SearchString: searchString,
        });
        if (response.Status === 1) {
          var { Timesheet, Detail, Total } = response.ResponseData;
          setTimeSheet(Timesheet);
          setTotal(Total);
          settDetailRecord(Detail);
          setDateRange([Timesheet.DateFrom, Timesheet.DateTo]);
          let cols = createColumns(Timesheet.DateFrom, Timesheet.DateTo);
          setColumns(cols);
          return;
        }
      } catch (error) {
        handleErrorOfRequest({ notify, error });
      } finally {
        setLoading(false);
      }
    }

    LoadData();
    return () => setColumns([]);
  }, [TimesheetId, reloading]);

  function createColumns(DateFrom, DateTo) {
    let start = dayjs(DateFrom);
    let end = dayjs(DateTo);
    let cols = defaultCols.map((element) => element);

    while (!start.isAfter(end, "day")) {
      let col = {
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
        width: 200,
        dataIndex: [start.format("YYYY-MM-DD"), "Checkin"],
        align: "center",
      };
      cols.push(col);
      start = start.add(1, "day");
    }
    return cols;
  }

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
          Checkin: (
            <RecordView
              key={record.Date}
              record={record}
              reloading={reloading}
              setReloading={setReloading}
            />
          ),
        };
        employeeId.push(record.EmployeeId);
        dataSrc.push(temp);
      } else {
        dataSrc[index][`${record.Date}`] = {
          Checkin: (
            <RecordView
              key={record.Date}
              record={record}
              reloading={reloading}
              setReloading={setReloading}
            />
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
      setUpdating(true);
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
      setUpdating(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Space direction="horizontal" align="center" wrap>
              <Tooltip title="Quay lại">
                <Button
                  onClick={() => navigate(-1)}
                  icon={<FontAwesomeIcon icon={faArrowLeft} fontSize={28} />}
                  type="text"
                  shape="circle"
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
              loading={updating}
              onClick={updateTimeSheet}
            >
              Cập nhật
            </Button>
            <ImportTimesheetData
              notify={notify}
              timesheetId={TimesheetId}
              setReloading={setReloading}
              reloading={reloading}
            />
          </Space>
        </Col>
      </Row>
      <Row wrap gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
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
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
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
      <Content style={{ paddingTop: 10 }}>
        <Row wrap gutter={[16, 16]} align="middle" style={{ marginBottom: 8 }}>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <Search
              allowClear
              ref={searchInputRef}
              onSearch={(value) => {
                setReloading(!reloading);
              }}
              enterButton
              placeholder="Tìm kiếm bằng mã, tên nhân viên"
            ></Search>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={16}
            xl={16}
            xxl={16}
            style={{ textAlign: "end" }}
          >
            <Space>
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
              <ExportReportComponent notify={notify} timesheet={timeSheet} />
            </Space>
          </Col>
          <Col span={24}>
            <Space direction="horizontal">
              <Space>
                <FontAwesomeIcon
                  icon={faCircle}
                  size="sm"
                  color={colorSuccessActive}
                />
                Đủ công
              </Space>
              <Space>
                <FontAwesomeIcon
                  icon={faCircle}
                  size="sm"
                  color={colorWarningActive}
                />
                Nửa công
              </Space>
              <Space>
                <FontAwesomeIcon
                  icon={faCircle}
                  size="sm"
                  color={colorBgTextActive}
                />
                Nghỉ
              </Space>
            </Space>
          </Col>
        </Row>
        <Table
          className="boxShadow0 rounded"
          loading={loading}
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
          size="small"
        ></Table>
      </Content>
    </Space>
  );
};

const RecordView = ({ record, reloading, setReloading, ...rest }) => {
  const {
    token: {
      colorBgTextActive,
      colorWarningActive,
      colorSuccessActive,
      colorErrorText,
      colorText,
    },
  } = theme.useToken();
  const [processing, setProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [notify, contextHolder] = notification.useNotification();
  const [totalHour, setTotalHour] = useState(record.TotalHour);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleSubmit = async (values) => {
    try {
      setProcessing(true);
      if (!values.Id) values.Id = record.Id;
      if (values.CheckinTime) {
        values.CheckinTime = values.CheckinTime.format(Config.TimeFormat);
      }
      if (values.CheckoutTime) {
        values.CheckoutTime = values.CheckoutTime.format(Config.TimeFormat);
      }
      console.log(values);
      const res = await UpdateTimesheetDetail(values);
      if (res.Status !== 1) {
        throw new Error(res.Description);
      }
      notify.success({
        message: <b>Thông báo</b>,
        description: "Đã cập nhật",
      });
      setReloading(!reloading);
      handleCancel();
      return;
    } catch (error) {
      handleErrorOfRequest({ notify, error });
    } finally {
      setProcessing(false);
    }
  };

  const timeView = () => {
    let checkinTime = null,
      checkoutTime = null;
    if (record.CheckinTime) {
      checkinTime = dayjs(record.CheckinTime, Config.TimeFormat).format(
        Config.NonSecondFormat
      );
    }

    if (record.CheckoutTime) {
      checkoutTime = dayjs(record.CheckoutTime, Config.TimeFormat).format(
        Config.NonSecondFormat
      );
    }
    let timeString = [];
    if (checkinTime || checkoutTime) {
      timeString.push(
        <span
          style={{ color: record.LateMinutes > 0 ? colorErrorText : colorText }}
        >
          {checkinTime || "--:--"}
        </span>
      );
      timeString.push(" - ");
      timeString.push(
        <span
          style={{
            color: record.EarlyMinutes > 0 ? colorErrorText : colorText,
          }}
        >
          {checkoutTime || "--:--"}
        </span>
      );
      if (record.RealWorkingHour) {
        timeString.push(
          <span
            style={{
              marginLeft: 2,
            }}
          >
            (
            <span
              style={{
                color:
                  record.RealWorkingHour < record.WorkingHour ? "red" : "black",
              }}
            >
              {record.RealWorkingHour.toFixed(2)}
            </span>
            h)
          </span>
        );
      }
    }
    return timeString;
  };

  const statusIcon = () => {
    if (!record.ShiftName) {
      return "";
    }
    if (record.CheckinTime || record.CheckoutTime) {
      return (
        <FontAwesomeIcon icon={faCircle} size="sm" color={colorSuccessActive} />
      );
    }
    if (!record.CheckoutTime && !record.CheckoutTime) {
      return (
        <FontAwesomeIcon icon={faCircle} size="sm" color={colorBgTextActive} />
      );
    }
    return (
      <FontAwesomeIcon icon={faCircle} size="sm" color={colorWarningActive} />
    );
  };

  useEffect(() => {
    if (open) {
      if (record.BreakAt && record.BreakEnd) {
        form.setFieldValue(
          "TotalBreak",
          dayjs(record.BreakEnd, Config.TimeFormat)
            .diff(dayjs(record.BreakAt, Config.TimeFormat), "hour", true)
            .toFixed(2)
        );
      }
    }
  }, [open, record.BreakAt, record.BreakEnd]);

  const calculateHour = () => {
    try {
      let checkinTime = form.getFieldValue("CheckinTime");
      let checkoutTime = form.getFieldValue("CheckoutTime");
      let startTime = dayjs(record.StartTime, Config.TimeFormat),
        finishTime = dayjs(record.FinishTime, Config.TimeFormat);
      let breakAt = null,
        breakEnd = null;
      if (record.BreakAt) breakAt = dayjs(record.BreakAt, Config.TimeFormat);
      if (record.BreakEnd) breakEnd = dayjs(record.BreakEnd, Config.TimeFormat);
      if (!breakAt || !breakEnd) {
        return checkoutTime.diff(checkoutTime, "hour", true);
      }
      var hour = 0;
      if (breakEnd) {
        if (breakEnd.isSameOrBefore(checkinTime)) {
          hour = checkoutTime.diff(checkinTime, "hour", true);
        } else if (breakAt.isSameOrBefore(checkinTime)) {
          hour = checkoutTime.diff(breakEnd, "hour", true);
          console.log(checkoutTime);
        } else {
          hour =
            checkoutTime.diff(checkinTime, "hour", true) -
            breakEnd.diff(breakAt, "hour", true);
        }
      }
      setTotalHour(hour);
      return hour;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {contextHolder}
      <Row onClick={showModal}>
        <Col flex="none">{statusIcon()}</Col>
        <Col flex="auto">
          <p style={{ margin: "unset" }}>{record.ShiftName}</p>
          <p style={{ margin: "unset" }}>{timeView()} </p>
        </Col>
      </Row>
      <Modal
        open={open}
        closable={true}
        title={
          <p style={{ fontSize: 18 }}>{`Chấm công ngày ${dayjs(
            record.Date
          ).format(Config.DateFormat)}`}</p>
        }
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={processing}
            onClick={handleOk}
          >
            Lưu
          </Button>,
        ]}
      >
        <p>
          {record.ShiftName} ({record.StartTime} - {record.FinishTime})
        </p>
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          labelAlign="left"
          labelWrap={true}
          onFinish={handleSubmit}
        >
          <Form.Item name="Id" hidden>
            <Input value={record.Id} readOnly />
          </Form.Item>
          <Form.Item label="Số công hưởng lương">
            <InputNumber value={record.WorkingHour} readOnly precision={2} />
          </Form.Item>
          <Form.Item label="Số giờ nghỉ" name="TotalBreak" initialValue={"0"}>
            <InputNumber readOnly />
          </Form.Item>
          <Form.Item label="Số công đi làm thực tế">
            <InputNumber
              value={record.RealWorkingHour}
              readOnly
              precision={2}
            />
          </Form.Item>
          <Form.Item
            label="Giờ vào"
            name="CheckinTime"
            initialValue={
              record.CheckinTime
                ? dayjs(record.CheckinTime, Config.TimeFormat)
                : null
            }
          >
            <TimePicker
              format={Config.NonSecondFormat}
              locale={locale}
              onChange={calculateHour}
            />
          </Form.Item>
          <Form.Item
            label="Giờ ra"
            name="CheckoutTime"
            initialValue={
              record.CheckoutTime
                ? dayjs(record.CheckoutTime, Config.TimeFormat)
                : null
            }
          >
            <TimePicker
              format={Config.NonSecondFormat}
              locale={locale}
              onChange={calculateHour}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const ExportReportComponent = ({ notify, timesheet, ...rest }) => {
  const [excelProcessing, setExcelProcessing] = useState(false);

  const exportTimesheetReport = async () => {
    var url;
    try {
      setExcelProcessing(true);
      var response = await ExportTimesheetBE({ Id: timesheet.Id });
      try {
        let jResponse = JSON.parse(response);
        notify.error({
          message: <b>Thông báo</b>,
          description: jResponse.Description,
        });
      } catch (error) {
        url = URL.createObjectURL(response);
        var link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", timesheet.Name);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      handleErrorOfRequest({ error, notify });
      console.error(error);
    } finally {
      setExcelProcessing(false);
      if ((url || "").length > 0) URL.revokeObjectURL(url);
    }
  };

  const handleMenuClick = async (e) => {
    console.log("click", e);
    switch (e.key) {
      case "excel":
        await exportTimesheetReport();
        break;
      default:
        break;
    }
  };
  const handleButtonClick = (e) => {
    message.info("Click on left button.");
    console.log("click left button", e);
  };
  const items = [
    {
      label: "Báo cáo tổng hợp",
      key: "excel",
      icon: excelProcessing ? (
        <FontAwesomeIcon
          icon={faRotateRight}
          spin
          style={{
            "--fa-primary-color": "#0f9d58",
            "--fa-secondary-color": "#0f9d58",
          }}
        />
      ) : (
        <FontAwesomeIcon
          icon={faFileExcel}
          style={{
            "--fa-primary-color": "#0f9d58",
            "--fa-secondary-color": "#0f9d58",
          }}
        />
      ),
    },
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <Dropdown.Button
      type="primary"
      menu={menuProps}
      onClick={handleButtonClick}
      icon={<DownOutlined />}
    >
      Báo cáo
    </Dropdown.Button>
  );
};

export { TimesheetDetailPage };
