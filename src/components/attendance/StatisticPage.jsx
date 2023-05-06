import React, { useEffect, useState } from "react";
import { useAuthState } from "../../Contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
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
import { Content } from "antd/es/layout/layout";
import { SearchOutlined } from "@ant-design/icons";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
import Config from "../../constant";
import { GetStatistic } from "./api";

const StatisticPage = ({ notify, loginRequired, ...rest }) => {
  const userDetails = useAuthState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  useEffect(() => {
    if (loginRequired && !userDetails.token) {
      notify.warning({
        message: "Yêu cầu đăng nhập để đổi mật khẩu.",
      });
      navigate("/login");
      return;
    }
  }, []);
  const loadStatistic = async (values) => {
    console.log(values);
    try {
      if (values.DateFrom) {
        values.DateFrom = values.DateFrom.format(Config.DateFormat);
      }
      if (values.DateTo) {
        values.DateTo = values.DateTo.format(Config.DateFormat);
      }
      var response = await GetStatistic(values);
      console.log(response);
      if(response.Status === 1)
      {
        setCurrentData(response.Data.Stat);
      }
    } catch (err) {
    } finally {
    }
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
            <Input placeholder="Tên nhân viên" />
          </Form.Item>
          <Form.Item name="DateFrom" wrapperCol={3} initialValue={dayjs()}>
            <DatePicker
              placeholder="Từ ngày"
              format={Config.DateFormat}
              dependencies={["DateTo", "DateFrom"]}
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
            <DatePicker placeholder="đến ngày" format={Config.DateFormat} />
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
            x: 900,
          }}
          style={{ borderColor: "black" }}
          dataSource={currentData}
          rowKey="Id"
        >
          <Column title="Nhân viên" dataIndex="FirstName"></Column>
          <Column title="Nhân viên" dataIndex="FirstCheckin"></Column>
          <Column title="Nhân viên" dataIndex="LastCheckin"></Column>
          {/* <Column></Column>
          <Column></Column>
          <Column></Column>
          <Column></Column> */}
        </Table>
      </Content>
    </Space>
  );
};

export { StatisticPage };
