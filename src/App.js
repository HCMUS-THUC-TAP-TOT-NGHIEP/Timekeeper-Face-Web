import React from "react";
import { Route, Routes } from "react-router";
import { ForgotPasswordPage, ResetPasswordPage } from "./components/authentication/ForgotPassword";
import LoginPage from "./components/authentication/Login";
import RegisterPage from "./components/authentication/Register";
import ChangePasswordPage from "./components/authentication/ChangePassword";
import { Dashboard } from "./components/dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Dashboard />} />
        <Route path="/register" exact element={<RegisterPage />} />
        <Route path="/login" exact element={<LoginPage />} />
        <Route path="/forgotpwd" exact element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:access_token" exact element={<ResetPasswordPage />} />
        <Route path="/changepwd" exact element={<ChangePasswordPage />} />
      </Routes>
    </>
  );
}

export default App;
