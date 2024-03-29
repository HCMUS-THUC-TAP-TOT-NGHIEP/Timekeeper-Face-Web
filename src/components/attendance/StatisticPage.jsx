import { SearchOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import Config from "../../constant";
import { GetStatistic } from "./api";
import { handleErrorOfRequest } from "../../utils/Helpers";
dayjs.extend(isSameOrBefore);

const col1 = {
  title: "Nhân viên",
  dataIndex: "EmployeeName",
  width: 300,
  fixed: "left",
};

const StatisticPage = ({ notify, loginRequired, ...rest }) => {
  const userDetails = useAuthState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [searchString, setSearchString] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [columns, setColumns] = useState([col1]);

  useEffect(() => {
    if (loginRequired && !userDetails.token) {
      notify.warning({
        message: "Yêu cầu đăng nhập để đổi mật khẩu.",
      });
      navigate("/login");
      return;
    }
    loadStatistic();
  }, [loginRequired, userDetails]);

  useEffect(() => {
    if (!dateRange[0] || !dateRange[1]) {
      return;
    }
    addColumns(dateRange[0], dateRange[1]);
  }, [dateRange]);

  let loadStatistic = async (values) => {
    try {
      var DateFromObject = values.DateFrom,
        DateToObject = values.DateTo,
        Keyword = searchString;
      setLoading(true);
      if (DateFromObject) {
        var dateFrom = DateFromObject.format("YYYY-MM-DD");
      }
      if (DateToObject) {
        var dateTo = DateToObject.format("YYYY-MM-DD");
      }
      var response = await GetStatistic({
        DateFrom: dateFrom,
        DateTo: dateTo,
        Keyword,
      });
      const { Status, ResponseData } = response;
      if (Status === 1) {
        setDateRange([DateFromObject, DateToObject]);
        setCurrentData(ResponseData.Statistics);
        setTotalRecords(ResponseData.Total);
      }
    } catch (error) {
      handleErrorOfRequest({ notify, error });
    } finally {
      setLoading(false);
    }
  };

  let addColumns = (DateFrom, DateTo) => {
    if (!DateFrom || !DateTo) {
      return [];
    }
    var cols = [col1];
    var date = DateFrom;
    for (; !date.isAfter(DateTo, "day"); ) {
      var col = {
        title: (
          <Typography.Text
            autoCapitalize="true"
            style={{ textTransform: "capitalize" }}
          >
            {date.locale("vi").format(`dddd`)}
            <br />
            {date.locale("vi").format(Config.DateFormat)}
          </Typography.Text>
        ),
        children: [
          {
            title: "Check in",
            dataIndex: [
              "CheckinList",
              date.format("YYYY-MM-DD"),
              "FirstCheckin",
            ],
            width: 120,
            key: `CheckinAt${date.format("YYYY-MM-DD")}`,
          },
          {
            title: "Check out",
            key: `CheckoutAt${date.format("YYYY-MM-DD")}`,
            dataIndex: [
              "CheckinList",
              date.format("YYYY-MM-DD"),
              "LastCheckin",
            ],
            width: 120,
          },
        ],
      };
      cols.push(col);
      date = date.add(1, "day");
    }
    setColumns(cols);
    return cols;
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Chấm công - Điểm danh
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <NavLink to="/">Dashboard</NavLink>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <NavLink to="">Chấm công - Điểm danh</NavLink>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}></Col>
      </Row>
      <Row wrap>
        <Form layout="inline" onFinish={loadStatistic} size="large">
          <Form.Item name="Employee" wrapperCol={3}>
            <Input
              placeholder="Tên nhân viên"
              onChange={(event) => setSearchString(event.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="DateFrom"
            wrapperCol={3}
            initialValue={dayjs()}
            dependencies={["DateTo"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  var dateTo = dayjs(getFieldValue("DateTo"));
                  if (!dateTo.isBefore(dayjs(value))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Ngày từ không hợp lệ nằm sau ngày đến.")
                  );
                },
              }),
            ]}
          >
            <DatePicker
              locale={locale}
              // onChange={(value) => setDateRange([value, dateRange[1]])}
              placeholder="Từ ngày"
              format={Config.DateFormat}
            />
          </Form.Item>
          <Form.Item
            name="DateTo"
            wrapperCol={3}
            dependencies={["DateFrom"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  var dateFrom = dayjs(getFieldValue("DateFrom"));
                  if (!dayjs(value).isBefore(dayjs(dateFrom))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Ngày từ không hợp lệ nằm sau ngày đến.")
                  );
                },
              }),
            ]}
            initialValue={dayjs()}
          >
            <DatePicker
              locale={locale}
              placeholder="đến ngày"
              format={Config.DateFormat}
              // onChange={(value) => setDateRange([dateRange[0], value])}
            />
          </Form.Item>

          <Form.Item wrapperCol={3}>
            <Button
              htmlType="submit"
              icon={<SearchOutlined />}
              type="primary"
              size="large"
            >
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
      </Row>
      <Content>
        <Table
          loading={loading}
          bordered
          scroll={{
            x: "calc(700px + 50%)",
          }}
          style={{ borderColor: "black" }}
          dataSource={currentData}
          rowKey="Id"
          locale={locale}
          pagination={{
            pageSize: 10,
            total: totalRecords,
            showTotal: (total) => `Tổng ${total} mục`,
          }}
          columns={columns}
        ></Table>
      </Content>
    </Space>
  );
};

export { StatisticPage };
