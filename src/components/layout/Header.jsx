import {
  DownOutlined,
  KeyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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
  Typography,
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
    label: <Link to="/profile/changepwd">Đổi mật khẩu</Link>,
    icon: <KeyOutlined style={{ fontSize: "16px" }} />,
  },
  {
    key: "3",
    label: (
      <Link
        onClick={async () => {
          const accessToken = localStorage.getItem("access_token");
          localStorage.removeItem("access_token");
          Logout(accessToken);
          window.location = "/login";
        }}
      >
        Đăng xuất
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
        const { Status, ResponseData } = response;
        if (Status === 1) {
          setUserInfo(ResponseData);
          setActive(false);
          return;
        }
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem("access_token");
        navigate("/login");
      });
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
            <span>
              <Avatar
                size={{
                  xs: 24,
                  sm: 32,
                  md: 40,
                }}
              >
                {userInfo ? userInfo.email[0] + userInfo.email[1] : ""}
              </Avatar>
              <DownOutlined fontSize="small" />
            </span>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
}

export default MyHeader;
