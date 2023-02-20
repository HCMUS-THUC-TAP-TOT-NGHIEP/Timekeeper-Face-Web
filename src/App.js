import React from "react";
import { Route, Routes } from "react-router";
import ForgotPasswordPage from "./components/authentication/ForgotPassword";
import LoginPage from "./components/authentication/Login";
import RegisterPage from "./components/authentication/Register";
import ChangePasswordPage from "./components/authentication/ChangePassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<h2>Hello world</h2>} />
        <Route path="/register" exact element={<RegisterPage/>} />
        <Route path="/login" exact element={<LoginPage/>} />
        <Route path="/forgotpwd" exact element={<ForgotPasswordPage/>} />
        <Route path="/changepwd" exact element={<ChangePasswordPage/>} />
      </Routes>
    </>
  );
}

export default App;
