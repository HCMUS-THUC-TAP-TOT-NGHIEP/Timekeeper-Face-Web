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
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import { getUserInfo } from "../../api";
import { Logout } from "../authentication/api";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { ReactComponent as Logo } from "../../logo.svg";

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
          let { User } = ResponseData;
          setUserInfo(User);
          return;
        }
        navigate("/login");
      })
      .catch((error) => {
        localStorage.removeItem("access_token");
        handleErrorOfRequest({ notify, error });
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
      className="boxShadow0"
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
          <Space size="small">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
            <NavLink to={"/"}>
              <Row align="middle">
                <Logo style={{ width: 31, height: 31, marginRight: 10 }} />
                <Typography.Title
                  level={4}
                  style={{
                    margin: 0,
                  }}
                >
                  Chấm công
                </Typography.Title>
              </Row>
            </NavLink>
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
