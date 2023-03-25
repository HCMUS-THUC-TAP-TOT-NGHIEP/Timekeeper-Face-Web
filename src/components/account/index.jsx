import React from "react";
import { Outlet } from "react-router-dom";
import { AccountListPage } from "./AccountListPage";
const AccountIndexPage = (props) => {
  return (
    <>
      <Outlet />
    </>
  );
};

export { AccountIndexPage, AccountListPage };
