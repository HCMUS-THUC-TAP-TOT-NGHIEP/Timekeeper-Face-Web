import {
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from "@ant-design/icons";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Col,
  Dropdown,
  Row,
  Skeleton,
  Space,
  theme,
  Typography
} from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserInfo } from "../../api";
import { Logout } from "../authentication/api";

const items = [
  {
    key: "1",
    label: <Link to="/profile">My Profile</Link>,
    icon: <AccountCircleIcon style={{ fontSize: "16px" }} />,
  },
  {
    key: "2",
    label: (
      <Link
        onClick={async () => {
          await Logout();
          localStorage.removeItem("access_token");
          window.location = "/login";
        }}
      >
        Log Out
      </Link>
    ),
    icon: <LogoutIcon style={{ fontSize: "16px" }} />,
  },
];

function MyHeader(props) {
  const { collapsed, setCollapsed } = props;
  const [userInfo, setUserInfo] = useState(null);
  const [active, setActive] = useState(true);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  useEffect(() => {
    getUserInfo()
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          setUserInfo(ResponseData);
          setActive(false);
          return;
        }
        navigate("/login");
      })
      .catch((error) => {});
  }, []);
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
        position: "sticky",
        zIndex: 999,
        top: 0,
      }}
    >
      <Row wrap={false}>
        <Col flex="auto">
          <Space>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
            <Typography.Title
              level={3}
              style={{
                margin: 0,
              }}
            >
              TimeKeeping Web
            </Typography.Title>
          </Space>
        </Col>
        <Col flex="none" style={{ paddingRight: "24px" }}>
          <Dropdown
            menu={{ items }}
            arrow
            placement="bottomRight"
            trigger="click"
          >
            <Space>
              <Avatar
                size={{
                  xs: 24,
                  sm: 32,
                  md: 40,
                }}
              >
                <Skeleton loading={active} active={active}>
                  {userInfo ? userInfo.email[0] + userInfo.email[1] : ""}
                </Skeleton>
              </Avatar>
              <DownOutlined fontSize="small" />
            </Space>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
}

export default MyHeader;
