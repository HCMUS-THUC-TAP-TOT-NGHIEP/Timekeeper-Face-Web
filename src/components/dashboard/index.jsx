import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { Breadcrumb, Layout, Typography } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../api";
import "./style.css";

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

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
          await logout();
        }}
      >
        Log Out
      </Link>
    ),
    icon: <LogoutIcon style={{ fontSize: "16px" }} />,
  },
];

export const Dashboard = function (props) {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Dashboard";
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <Breadcrumb>
      <Breadcrumb.Item>
          <Link to="/dashboard">Dashboard</Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};
