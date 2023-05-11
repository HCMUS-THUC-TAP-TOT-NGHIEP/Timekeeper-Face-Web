import {
  DownOutlined,
  KeyOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Row,
  Space,
  Typography,
  notification,
  theme,
} from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import { getUserInfo } from "../../api";
import { Logout } from "../authentication/api";

const items = [
  {
    key: "1",
    label: <Link to="/profile">My Profile</Link>,
    icon: <UserOutlined style={{ fontSize: "16px" }} />,
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
    icon: <LogoutOutlined style={{ fontSize: "16px" }} />,
  },
];

function MyHeader(props) {
  const { collapsed, setCollapsed } = props;
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [notify, contextHolder] = notification.useNotification();
  const authState = useAuthState();

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  useEffect(() => {
    if (!authState.token) {
      navigate("/login");
    }
    getUserInfo()
      .then((response) => {
        const { Status, ResponseData } = response;
        if (Status === 1) {
          setUserInfo(ResponseData);
          return;
        }
        navigate("/login");
      })
      .catch((error) => {
        localStorage.removeItem("access_token");
        if (error.response) {
          notify.error({
            message: "Có lỗi ở response.",
            description: `[${error.response.statusText}]`,
          });
        } else if (error.request) {
          notify.error({
            message: "Có lỗi ở request.",
            description: error,
          });
        } else {
          notify.error({
            message: "Có lỗi ở máy khách",
            description: error.message,
          });
        }
        navigate("/login");
      });
  }, []);

  const createAvatar = (userInfo) => {
    var str = "";
    if (userInfo) {
      if (userInfo.Username) {
        str = String(userInfo.Username);
      } else {
        str = String(userInfo.Email);
      }
    }
    return (
      <Avatar
        size={{
          xs: 24,
          sm: 32,
          md: 40,
        }}
        style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
      >
        {String(str[0] + str[1])}
      </Avatar>
    );
  };

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
      {contextHolder}
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
              Trang web quản lý
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
            <Button type="link">
              <Space>
                {createAvatar(userInfo)}
                <DownOutlined fontSize="small" />
              </Space>
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
}

export default MyHeader;
