import { BarsOutlined } from "@ant-design/icons";
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

function MySidebar(props) {
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
                Nhân viên
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
                Phòng ban
              </NavLink>
            ),
          },
          {
            key: "4",
            icon: <BarsOutlined fontSize="large" />,
            label: (
              <NavLink
                to="/shift-list"
                className={({ isActive }) =>
                  isActive ? setSelectedKey("4") : undefined
                }
              >
                Ca làm việc
              </NavLink>
            ),
          },
          {
            key: "sub1",
            icon: <AccessTimeFilledIcon fontSize="large" />,
            label: <div>Chấm công</div>,
            children: [
              {
                key: "opt1",
                icon: <AccessTimeFilledIcon fontSize="large" />,
                label: (
                  <NavLink
                    to=""
                    className={({ isActive }) =>
                      isActive ? setSelectedKey("5") : undefined
                    }
                  >
                    Phân ca làm việc
                  </NavLink>
                ),
              },
              {
                key: "opt2",
                icon: <AccessTimeFilledIcon fontSize="large" />,
                label: (
                  <NavLink
                    to=""
                    className={({ isActive }) =>
                      isActive ? setSelectedKey("opt2") : undefined
                    }
                  >
                    Bảng chấm công
                  </NavLink>
                ),
              },
              {
                key: "opt3",
                icon: <AccessTimeFilledIcon fontSize="large" />,
                label: (
                  <NavLink
                    to=""
                    className={({ isActive }) =>
                      isActive ? setSelectedKey("opt3") : undefined
                    }
                  >
                    Báo cáo đi muộn, về sớm
                  </NavLink>
                ),
              },
            ],
          },
          {
            key: "6",
            icon: <NotificationsActiveIcon fontSize="large" />,
            label: (
              <NavLink
                to="/notification"
                className={({ isActive }) =>
                  isActive ? setSelectedKey("6") : undefined
                }
              >
                <Space>
                  Thông báo
                  <Badge count={0} />
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
