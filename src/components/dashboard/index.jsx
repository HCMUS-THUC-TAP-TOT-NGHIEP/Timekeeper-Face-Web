import { faBuildingUser, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Card,
  Col,
  Row,
  Space,
  Spin,
  Statistic,
  Typography,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import CountUp from "react-countup";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { GetDepartmentList } from "../department/api";
import { GetManyEmployee } from "../employee/api";
import { GetEarlyLateCount, GetOffCount } from "./api";
import "./style.css";

const formatter = (value) => <CountUp end={value} separator="," />;

export const Dashboard = function ({ notify, ...rest }) {
  const userDetails = useAuthState();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Tổng quan";
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <>
      <Row wrap align="middle" style={{ marginBottom: 24 }} gutter={[24, 24]}>
        <Col flex="none">
          <Space direction="vertical" size="small">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Xin chào {userDetails.user ? ", " + userDetails.username : ""}!
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <NavLink to="/">Dashboard</NavLink>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}></Col>
      </Row>
      <Row wrap align="middle" style={{ marginBottom: 24 }} gutter={[24, 24]}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <EmployeeCard notify={notify} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <DepartmentCard notify={notify} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <EarlyLateCard notify={notify} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <OffCard notify={notify} />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <EarlyLateChart notify={notify} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <OffChart notify={notify} />
        </Col>
      </Row>
    </>
  );
};

const DepartmentCard = ({ notify, ...rest }) => {
  const [totalOfDepartment, setTotalOfDepartment] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let res = await GetDepartmentList();
        if (res.Status === 1) {
          let { Total } = res.ResponseData;
          setTotalOfDepartment(Total);
          return;
        }
        throw new Error(res.Description);
      } catch (error) {
        handleErrorOfRequest({ notify, error });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [notify]);
  return (
    <Spin spinning={loading}>
      <Card className="boxShadow0">
        <Row align="middle" justify={"space-between"}>
          <Col>
            <Statistic
              title={<b style={{ fontSize: 14 }}> Phòng ban </b>}
              value={totalOfDepartment}
              formatter={formatter}
              valueStyle={{ fontSize: 30, fontWeight: 700 }}
            />
          </Col>
          <Col>
            <FontAwesomeIcon icon={faBuildingUser} size="3x" />
          </Col>
        </Row>
      </Card>
    </Spin>
  );
};

const EmployeeCard = ({ notify, ...rest }) => {
  const [totalOfEmployee, setTotalOfEmployee] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let res = await GetManyEmployee();
        if (res.Status === 1) {
          let { Total } = res.ResponseData;
          setTotalOfEmployee(Total);
          return;
        }
        throw new Error(res.Description);
      } catch (error) {
        handleErrorOfRequest({ notify, error });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [notify]);

  return (
    <Spin spinning={loading}>
      <Card className="boxShadow0">
        <Row align="middle" justify={"space-between"}>
          <Col>
            <Statistic
              title={<b style={{ fontSize: 14 }}> Nhân viên </b>}
              value={totalOfEmployee}
              formatter={formatter}
              valueStyle={{ fontSize: 30, fontWeight: 700 }}
            />
          </Col>
          <Col>
            <FontAwesomeIcon icon={faUser} size="3x" />
          </Col>
        </Row>
      </Card>
    </Spin>
  );
};

const EarlyLateCard = ({ notify, ...rest }) => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let firstDay = dayjs().locale("vi").toISOString().replace("Z", "");
        let response = await GetEarlyLateCount({
          DateFrom: firstDay,
          DateTo: null,
        });
        console.log(response);
        if (response.Status === 1) {
          let { CountList } = response.ResponseData;
          setTotal(CountList[0]);
          return;
        }
        throw new Error(response.Description);
      } catch (error) {
        handleErrorOfRequest({ notify, error });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [notify]);

  return (
    <Spin spinning={loading}>
      <Card className="boxShadow0">
        <Row align="middle" justify={"space-between"}>
          <Col>
            <Statistic
              title={<b style={{ fontSize: 14 }}> Đi muộn về sớm </b>}
              value={total}
              formatter={formatter}
              valueStyle={{ fontSize: 30, fontWeight: 700 }}
            />
          </Col>
          <Col>
            <FontAwesomeIcon icon={faUser} size="3x" />
          </Col>
        </Row>
      </Card>
    </Spin>
  );
};

const OffCard = ({ notify, ...rest }) => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let firstDay = dayjs().locale("vi").toISOString().replace("Z", "");
        let response = await GetOffCount({
          DateFrom: firstDay,
          DateTo: null,
        });
        if (response.Status === 1) {
          let { CountList } = response.ResponseData;
          setTotal(CountList[0]);
          return;
        }
        throw new Error(response.Description);
      } catch (error) {
        handleErrorOfRequest({ notify, error });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [notify]);

  return (
    <Spin spinning={loading}>
      <Card className="boxShadow0">
        <Row align="middle" justify={"space-between"}>
          <Col>
            <Statistic
              title={<b style={{ fontSize: 14 }}> Số nhân viên nghỉ </b>}
              value={total}
              formatter={formatter}
              valueStyle={{ fontSize: 30, fontWeight: 700 }}
            />
          </Col>
          <Col>
            <FontAwesomeIcon icon={faUser} size="3x" />
          </Col>
        </Row>
      </Card>
    </Spin>
  );
};

const EarlyLateChart = ({ notify, ...rest }) => {
  const [options, setOptions] = useState({
    chart: {
      id: "EarlyLateChart",
    },
    xaxis: {
      categories: [],
    },
  });
  const [series, setSeries] = useState([
    {
      name: "series-1",
      data: [],
    },
  ]);
  const [loading, setLoading] = useState(false);
  // const [month, setMonth] = useState(dayjs().month);
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let firstDay = dayjs().startOf("month").add(1, "day").toISOString();
        let lastDay = dayjs().endOf("month").add(1, "day").toISOString();
        let response = await GetEarlyLateCount({
          DateFrom: firstDay,
          DateTo: lastDay,
        });
        if (response.Status === 1) {
          let { CountList, DateList } = response.ResponseData;
          setOptions({
            chart: {
              id: "EarlyLateChart",
            },
            xaxis: {
              categories: DateList,
            },
            stroke: {
              curve: "smooth",
            },
          });
          setSeries([
            {
              name: "Số nhân viên",
              data: CountList,
            },
          ]);
          return;
        }
      } catch (error) {
        handleErrorOfRequest({ notify, error });
      } finally {
        setLoading(false);
      }
    }
    loadData();
    // }, [notify, month]);
  }, [notify]);

  return (
    <Spin spinning={loading}>
      <Card className="boxShadow0">
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Đi muộn về sớm
        </Typography.Title>
        <Chart options={options} series={series} type="line" />
      </Card>
    </Spin>
  );
};

const OffChart = ({ notify, ...rest }) => {
  const [options, setOptions] = useState({
    chart: {
      id: "EarlyLateChart",
    },
    xaxis: {
      categories: [],
    },
  });
  const [series, setSeries] = useState([
    {
      name: "series-1",
      data: [],
    },
  ]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let firstDay = dayjs().startOf("month").add(1, "day").toISOString();
        let lastDay = dayjs().endOf("month").add(1, "day").toISOString();
        let response = await GetOffCount({
          DateFrom: firstDay,
          DateTo: lastDay,
        });
        if (response.Status === 1) {
          let { CountList, DateList } = response.ResponseData;
          setOptions({
            chart: {
              id: "EarlyLateChart",
            },
            xaxis: {
              categories: DateList,
            },
            stroke: {
              curve: "smooth",
            },
          });
          setSeries([{ type: "line", name: "Số nhân viên", data: CountList }]);
          return;
        }
      } catch (error) {
        handleErrorOfRequest({ notify, error });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [notify]);

  return (
    <Spin spinning={loading}>
      <Card className="boxShadow0">
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Nghỉ/ vắng
        </Typography.Title>
        <Chart options={options} series={series} />
      </Card>
    </Spin>
  );
};
