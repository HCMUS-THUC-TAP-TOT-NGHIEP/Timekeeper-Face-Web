import {
  faClock,
  faGauge,
  faList,
  faUniversalAccess,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "antd";
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
      breakpoint="lg"
      collapsedWidth={80}
      width={250}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
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
            label: <div>Nhân viên</div>,
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
            label: <div>Ca làm việc</div>,
            children: [
              {
                key: "group3-opt1",
                label: <NavLink to="/shift">Ca làm việc</NavLink>,
              },
              // {
              //   key: "group3-opt2",
              //   label: (
              //     <NavLink to="/shift/assignment">Phân ca chi tiết</NavLink>
              //   ),
              // },
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
            label: <div>Chấm công</div>,
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
              // {
              //   key: "sub2-summary",
              //   label: (
              //     <NavLink to="/timesheet/timekeeping/timesheet-summary">
              //       Bảng chấm công tổng hợp
              //     </NavLink>
              //   ),
              // },
              // {
              //   key: "sub2-opt1",
              //   label: (
              //     <NavLink to="/timesheet/timekeeper">
              //       Thống kê điểm danh
              //     </NavLink>
              //   ),
              // },
            ],
          },
          {
            key: "group1",
            icon: <FontAwesomeIcon icon={faUniversalAccess} />,
            label: <NavLink to="/manage/account">Người dùng</NavLink>,
          },
          // {
          //   key: "6",
          //   icon: <FontAwesomeIcon icon={faBell} />,
          //   label: (
          //     <NavLink to="/notification">
          //       <Space>
          //         Thông báo
          //         <Badge count={0} />
          //       </Space>
          //     </NavLink>
          //   ),
          // },
        ]}
      />
    </Sider>
  );
}

export default MySidebar;
