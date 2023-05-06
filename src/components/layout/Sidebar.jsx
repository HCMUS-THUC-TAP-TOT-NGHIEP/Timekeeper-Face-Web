import { BarsOutlined, ControlFilled } from "@ant-design/icons";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Badge, Menu, Space } from "antd";
import Sider from "antd/es/layout/Sider";
import React from "react";
import { NavLink } from "react-router-dom";
import "./style.css";

function MySidebar(props) {
  // const [selectedKey, setSelectedKey] = useState("1");
  const { collapsed } = props;
  return (
    <Sider
      // trigger={null}
      collapsible
      collapsed={collapsed}
      // breakpoint="lg"
      // collapsedWidth="0"
    >
      <div className="logo" />

      <Menu
        theme="dark"
        mode="inline"
        items={[
          {
            key: "1",
            icon: <DashboardIcon fontSize="large" />,
            label: <NavLink to="/dashboard">Dashboard</NavLink>,
          },
          {
            key: "group1",
            icon: <ControlFilled fontSize="large" />,
            label: <div>Hệ thống</div>,
            children: [
              {
                key: "group1-opt1",
                label: <NavLink to="/manage/account">Tài khoản</NavLink>,
              },
              {
                key: "group1-opt2",
                label: (
                  <NavLink to="/manage/account">Phân quyền sử dụng</NavLink>
                ),
              },
            ],
          },

          {
            key: "group2",
            icon: <PeopleAltIcon fontSize="large" />,
            label: <div>Nhân viên</div>,
            children: [
              {
                key: "group2-opt1",
                label: <NavLink to="/employee">Tất cả nhân viên</NavLink>,
              },
              {
                key: "group2-opt2",
                label: <NavLink to="/department">Phòng ban</NavLink>,
              },
            ],
          },
          {
            key: "group3",
            icon: <BarsOutlined fontSize="large" />,
            label: <div>Ca làm việc</div>,
            children: [
              {
                key: "group3-opt1",
                label: <NavLink to="/shift">Danh mục ca làm việc</NavLink>,
              },
              {
                key: "group3-opt2",
                label: (
                  <NavLink to="/shift/assignment">Phân ca làm việc</NavLink>
                ),
              },
              {
                key: "group3-opt3",
                label: (
                  <NavLink to="/shift/assignment/list">
                    Bảng phân ca làm việc
                  </NavLink>
                ),
              },
            ],
          },
          {
            key: "sub2",
            icon: <AccessTimeFilledIcon fontSize="large" />,
            label: <div>Chấm công</div>,
            children: [
              {
                key: "sub2-opt1",
                label: <NavLink to="/attendance/statistic">Thống kê điểm danh</NavLink>,
              },
              {
                key: "sub2-opt2",
                label: <NavLink to="/attendance/summary">Bảng chấm công</NavLink>,
              },
              {
                key: "sub2-opt3",
                label: <NavLink to="/attendance/report">Báo cáo đi muộn, về sớm</NavLink>,
              },
            ],
          },
          {
            key: "6",
            icon: <NotificationsActiveIcon fontSize="large" />,
            label: (
              <NavLink to="/notification">
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
