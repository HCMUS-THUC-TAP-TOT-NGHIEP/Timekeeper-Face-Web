import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";

const DepartmentPageIndex = ({ notify, loginRequired, ...rest }) => {
  const userDetails = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Phòng ban";
    if (loginRequired && !userDetails.token) {
      notify.warning({
        message: "Yêu cầu đăng nhập để tiếp tục.",
      });
      navigate("/login");
      return;
    }
  }, []);
  return <Outlet />;
};

export * from "./AddPage";
export * from "./EditPage";
export * from "./ListPage";
export { DepartmentPageIndex };
