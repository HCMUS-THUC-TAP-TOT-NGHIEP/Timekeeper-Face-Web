import React, { useEffect, useState } from "react";
import { getUserInfo } from "./api";

export const Dashboard = function (props) {
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    getUserInfo()
      .then((response) => {
        console.log(response);
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          setUserInfo(ResponseData);
        }
      })
      .catch((error) => {});
  }, []);
  return <h2>userInfo</h2>;
};
