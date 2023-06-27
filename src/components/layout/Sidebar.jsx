import {
  faClock,
  faGauge,
  faList,
  faUniversalAccess,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import React from "react";
import { NavLink } from "react-router-dom";
import "./style.css";

function MySidebar(props) {
  // const [selectedKey, setSelectedKey] = useState("1");
  const { collapsed } = props;
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth={80}
      width={250}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 10,
        bottom: 0,
      }}
    >
      <div className="logo" />

      <Menu
        theme="dark"
        mode="inline"
        items={[
          {
            key: "1",
            icon: <FontAwesomeIcon icon={faGauge} />,
            label: <NavLink to="/dashboard">Tổng quan</NavLink>,
          },
          {
            key: "group2",
            icon: <FontAwesomeIcon icon={faUsers} />,
            label: "Nhân viên",
            children: [
              {
                key: "group2-opt1",
                label: <NavLink to="/employee">Danh mục nhân viên</NavLink>,
              },
              {
                key: "group2-opt2",
                label: <NavLink to="/department">Danh mục phòng ban</NavLink>,
              },
            ],
          },
          {
            key: "group3",
            icon: <FontAwesomeIcon icon={faList} />,
            label: "Ca làm việc",
            children: [
              {
                key: "group3-opt1",
                label: <NavLink to="/shift">Ca làm việc</NavLink>,
              },
              {
                key: "group3-opt3",
                label: (
                  <NavLink to="/shift/assignment/list">
                    Phân ca chi tiết
                  </NavLink>
                ),
              },
            ],
          },
          {
            key: "sub2",
            icon: <FontAwesomeIcon icon={faClock} />,
            label: "Chấm công",
            children: [
              {
                key: "sub2-timekeeper_v2",
                label: (
                  <NavLink to="/timesheet/timekeeper_v2">
                    Dữ liệu chấm công
                  </NavLink>
                ),
              },
              {
                key: "sub2-timesheet-detail",
                label: (
                  <NavLink to="/timesheet/timekeeping/timesheet-detail">
                    Bảng chấm công chi tiết
                  </NavLink>
                ),
              },
            ],
          },
          {
            key: "group1",
            icon: <FontAwesomeIcon icon={faUniversalAccess} />,
            label: <NavLink to="/manage/account">Người sử dụng</NavLink>,
          },
        ]}
      />
    </Sider>
  );
}

export default MySidebar;
