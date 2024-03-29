import { Breadcrumb } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

export const Dashboard = function (props) {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Tổng quan";
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
