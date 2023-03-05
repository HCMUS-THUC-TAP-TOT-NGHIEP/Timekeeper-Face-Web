import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Badge, Menu, Space } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./style.css";

let activeStyle = {
  textDecoration: "underline",
};

let activeClassName = "underline";

function MySidebar(props) {
  const [show, setShow] = useState(true);
  const [selectedKey, setSelectedKey] = useState("1");
  const { collapsed } = props;

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={[
          {
            key: "1",
            icon: <DashboardIcon fontSize="large" />,
            label: (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? setSelectedKey("1") : undefined
                }
              >
                Dashboard
              </NavLink>
            ),
          },
          {
            key: "2",
            icon: <PeopleAltIcon fontSize="large" />,
            label: (
              <NavLink
                to="/employee"
                className={({ isActive }) =>
                  isActive ? setSelectedKey("2") : undefined
                }
              >
                Employee
              </NavLink>
            ),
          },
          {
            key: "3",
            icon: <BusinessCenterIcon fontSize="large" />,
            label: (
              <NavLink
                to="/department"
                className={({ isActive }) =>
                  isActive ? setSelectedKey("3") : undefined
                }
              >
                Department
              </NavLink>
            ),
          },
          {
            key: "4",
            icon: <AccessTimeFilledIcon fontSize="large" />,
            label: (
              <NavLink
                to="/attendance"
                className={({ isActive }) =>
                  isActive ? setSelectedKey("4") : undefined
                }
              >
                Time Attendance
              </NavLink>
            ),
          },
          {
            key: "5",
            icon: <NotificationsActiveIcon fontSize="large" />,
            label: (
              <NavLink
                to="/notification"
                className={({ isActive }) =>
                  isActive ? setSelectedKey("5") : undefined
                }
              >
                <Space>
                  Notification
                  <Badge count={show ? 109 : 0} />
                </Space>
              </NavLink>
            ),
          },
        ]}
      />
    </Sider>
  );
}

export default MySidebar;
