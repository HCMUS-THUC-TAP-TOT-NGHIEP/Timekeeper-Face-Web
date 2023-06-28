import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AccountListPage } from "./AccountListPage";
import { CheckAuthorization } from "./api";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { useAuthDispatch, useAuthState } from "../../Contexts/AuthContext";

const AccountIndexPage = ({ notify, ...rest }) => {
  const userDetails = useAuthState();
  const dispatch = useAuthDispatch();
  useEffect(() => {});

  useEffect(() => {
    document.title = "Danh mục người dùng";
    checkAuthorization();
  }, []);

  async function checkAuthorization() {
    try {
      var response = await CheckAuthorization({
        MenuName: "User",
        Permissions: [],
      });
      if (response.Status === 1) {
        let { Authorization } = response.ResponseData;
        console.log("User authorization", Authorization);
        dispatch({
          type: "CHECK_AUTHORIZATION",
          payload: {
            current: userDetails,
            permission: Authorization,
          },
        });
        return;
      }
      throw new Error(response.Description);
    } catch (error) {
      handleErrorOfRequest(error, notify);
    } finally {
    }
  }
  return (
    <>
      <Outlet />
    </>
  );
};

export { AccountIndexPage, AccountListPage };
