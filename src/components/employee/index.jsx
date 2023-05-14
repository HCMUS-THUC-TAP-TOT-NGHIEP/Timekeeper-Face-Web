import { Outlet, useNavigate } from "react-router-dom";
import { AllEmployeesPage } from "./AllEmployeePage";
import { EditEmployeePage } from "./EditEmployeePage";
import { EmployeeProfile } from "./EmployeeProfile";
import { NewEmployeePage } from "./NewEmployeePage";
import { useEffect } from "react";
import { useAuthState } from "../../Contexts/AuthContext";

const EmployeePageIndex = ({ notify, loginRequired, ...rest }) => {
  const userDetails = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Nhân viên";
    if (loginRequired && !userDetails.token) {
      notify.warning({
        message: "Yêu cầu đăng nhập để đổi mật khẩu.",
      });
      navigate("/login");
      return;
    }
  }, []);
  return <Outlet />;
};

export {
  EmployeePageIndex,
  AllEmployeesPage,
  EmployeeProfile,
  EditEmployeePage,
  NewEmployeePage,
};
