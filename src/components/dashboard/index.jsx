import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "./api";

export const Dashboard = function (props) {
  const [userInfo, setUserInfo] = useState({});
  let navigate = useNavigate();
  useEffect(() => {
    document.title = "Dashboard";
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      navigate("/login");
      return;
    }
    getUserInfo()
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          setUserInfo(ResponseData);
        }
      })
      .catch((error) => {});
  }, []);
  return <h2>{userInfo.email}</h2>;
};
