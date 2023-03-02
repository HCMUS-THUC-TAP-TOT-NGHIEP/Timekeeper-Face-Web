import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Badge, Menu, Space } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

function MySidebar(props) {
  const [show, setShow] = useState(true);

  const items = [
    {
      key: "1",
      icon: <DashboardIcon fontSize="large" />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <PeopleAltIcon fontSize="large" />,
      label: <Link to="/employee">Employee</Link>,
    },
    {
      key: "3",
      icon: <BusinessCenterIcon fontSize="large" />,
      label: <Link to="/department">Department</Link>,
    },
    {
      key: "4",
      icon: <AccessTimeFilledIcon fontSize="large" />,
      label: <Link to="/attendance">Time Attendance</Link>,
    },
    {
      key: "5",
      icon: <NotificationsActiveIcon fontSize="large" />,
      label: (
        <Link to="/notification">
          <Space>
            Notification
            <Badge count={show ? 109 : 0} />
          </Space>
        </Link>
      ),
    },
  ];
  const { collapsed } = props;
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={[
          {
            key: "1",
            icon: <DashboardIcon fontSize="large" />,
            label: <Link to="/dashboard">Dashboard</Link>,
          },
          {
            key: "2",
            icon: <PeopleAltIcon fontSize="large" />,
            label: <Link to="/employee">Employee</Link>,
          },
          {
            key: "3",
            icon: <BusinessCenterIcon fontSize="large" />,
            label: <Link to="/department">Department</Link>,
          },
          {
            key: "4",
            icon: <AccessTimeFilledIcon fontSize="large" />,
            label: <Link to="/attendance">Time Attendance</Link>,
          },
          {
            key: "5",
            icon: <NotificationsActiveIcon fontSize="large" />,
            label: (
              <Link to="/notification">
                <Space>
                  Notification
                  <Badge count={show ? 109 : 0} />
                </Space>
              </Link>
            ),
          },
        ]}
      />
    </Sider>
  );
}

export default MySidebar;
