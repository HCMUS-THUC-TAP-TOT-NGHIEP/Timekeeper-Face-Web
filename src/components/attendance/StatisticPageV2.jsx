import { SearchOutlined } from "@ant-design/icons";
import {
  faFileExport,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
  theme,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import { Content } from "antd/es/layout/layout";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import Config from "../../constant";
import { compareDatetime, compareString } from "../../utils/Comparation";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { ImportTimekeeperData } from "./ImportComponent";
import { ExportAttendanceStatisticBE, GetStatisticV2 } from "./api";
dayjs.extend(isSameOrBefore);

const col1 = {
  title: "Nhân viên",
  dataIndex: "EmployeeName",
  width: 300,
  fixed: "left",
};

const StatisticPageV2 = ({ notify, loginRequired, ...rest }) => {
  const userDetails = useAuthState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  useEffect(() => {
    if (loginRequired && !userDetails.token) {
      notify.warning({
        message: "Yêu cầu đăng nhập để đổi mật khẩu.",
      });
      navigate("/login");
      return;
    }
    form.setFieldsValue({
      Keyword: "",
      DateRange: [dayjs().date(1), dayjs()],
    });
    form.submit();
  }, [loginRequired, userDetails]);

  useEffect(() => {
    form.submit();
  }, [page, pageSize]);

  let loadStatistic = async (values) => {
    try {
      var DateFromObject = values.DateRange[0],
        DateToObject = values.DateRange[1],
        Keyword = values.Keyword;
      setLoading(true);
      if (DateFromObject) {
        var dateFrom = DateFromObject.format("YYYY-MM-DD");
      }
      if (DateToObject) {
        var dateTo = DateToObject.format("YYYY-MM-DD");
      }
      var response = await GetStatisticV2({
        DateFrom: dateFrom,
        DateTo: dateTo,
        Keyword,
        Page: page,
        PageSize: pageSize,
      });
      const { Status, ResponseData } = response;
      if (Status === 1) {
        setCurrentData(ResponseData.Statistics);
        setTotal(ResponseData.Total);
        return;
      }
      notify.error({
        message: "",
        description: response.Description,
      });
    } catch (error) {
      handleErrorOfRequest({ notify, error });
    } finally {
      setLoading(false);
    }
  };
  const exportTimesheetReport = async () => {
    var url;
    try {
      setProcessing(true);
      var dateRange = form.getFieldValue("DateRange"),
        keyword = form.getFieldValue("Keyword");
      var response = await ExportAttendanceStatisticBE({
        DateFrom: dateRange[0],
        DateTo: dateRange[1],
        Keyword: keyword,
      });
      try {
        var data = JSON.parse(response);
        if (data.Status !== 1) {
          notify.error({
            message: <b>Thông báo</b>,
            description: data.Description,
          });
        }
      } catch (error) {
        url = URL.createObjectURL(response);
        var link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Dữ liệu chấm công từ ngày ${dateRange[0].format(
            Config.DateFormat
          )} dến ngày ${dateRange[1].format(Config.DateFormat)}`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      handleErrorOfRequest({ error, notify });
      console.error(error);
    } finally {
      setProcessing(false);
      if ((url || "").length > 0) URL.revokeObjectURL(url);
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Dữ liệu chấm công
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <NavLink to="/">Dashboard</NavLink>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <NavLink to="">Chấm công</NavLink>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <ImportTimekeeperData notify={notify} />
        </Col>
      </Row>
      <Row wrap align="middle">
        <Col flex="none">
          <Form layout="inline" onFinish={loadStatistic} form={form}>
            <Space wrap>
              <Form.Item name="Keyword" wrapperCol={3}>
                <Input
                  placeholder="Tìm kiếm"
                  suffix={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                />
              </Form.Item>
              <Form.Item
                name="DateRange"
                wrapperCol={3}
                initialValue={[dayjs(), dayjs()]}
              >
                <DatePicker.RangePicker
                  locale={locale}
                  format={Config.DateFormat}
                  allowClear={true}
                />
              </Form.Item>
              <Form.Item wrapperCol={3}>
                <Button
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  type="primary"
                >
                  Tìm kiếm
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space>
            <Tooltip title="Xuất dữ liệu chấm công" placement="rightTop">
              <Button
                type="default"
                icon={
                  <FontAwesomeIcon
                    icon={faFileExport}
                    style={{ paddingRight: 4 }}
                  />
                }
                onClick={exportTimesheetReport}
                loading={processing}
              >
                Xuất báo cáo
              </Button>
            </Tooltip>
          </Space>
        </Col>
      </Row>
      <Content
        style={{ background: colorBgContainer, padding: 20 }}
        className="boxShadow0 rounded"
      >
        <Table
          loading={loading}
          bordered
          scroll={{
            x: "calc(700px + 50%)",
            y: "800px",
          }}
          style={{ borderColor: "black" }}
          dataSource={currentData}
          locale={locale}
          pagination={{
            total: total,
            showTotal: (total) => `Tổng ${total} bản ghi`,
            defaultPageSize: 50,
            pageSizeOptions: [50, 100],
            onChange: (page, pageSize) => {
              setPageSize(pageSize);
              setPage(page);
            },
            showSizeChanger: true,
          }}
          rowKey={(record) => `${record.Id}${record.Time}`}
          caption={<b>Chỉ lấy giờ chấm công vào sớm nhất và ra trễ nhất</b>}
        >
          <Column
            title="#"
            width={80}
            render={(_, __, index) => index + 1}
            align="right"
          />
          <Column
            title="Ngày chấm công"
            width={150}
            sorter={(a, b) => compareDatetime(a, b, "Date")}
            defaultSortOrder={["descending"]}
            render={(record) => dayjs(record.Date).format(Config.DateFormat)}
            align="center"
          />
          <Column
            title="Mã NV"
            dataIndex="Id"
            width={100}
            sorter={(a, b) => a.Id > b.Id}
            align="right"
          />
          <Column
            title="Họ và tên"
            dataIndex="EmployeeName"
            width={200}
            sorter={(a, b) => compareString(a, b, "EmployeeName")}
          />
          <Column
            title="Vị trí công việc"
            dataIndex="Position"
            width={200}
            sorter={(a, b) => compareString(a, b, "EmployeeName")}
          />
          <Column
            title="Giờ công vào"
            dataIndex="Time"
            width={150}
            render={(_, record) =>
              dayjs(record.Time).format(Config.NonSecondFormat)
            }
            defaultSortOrder={["ascending"]}
            align="center"
          />
          <Column
            title="Phương thức chấm công"
            dataIndex="MethodText"
            width={150}
          />
          <Column
            title="Ảnh đính kèm"
            width={200}
            dataIndex="DownloadUrl"
            render={(value, record) => {
              return <Image src={value} height={50} />;
            }}
            align="center"
          />
        </Table>
      </Content>
    </Space>
  );
};

export { StatisticPageV2 };
