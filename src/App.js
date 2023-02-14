import React from "react";
import { Route, Routes } from "react-router";
import ForgotPasswordPage from "./components/authentication/ForgotPassword";
import LoginPage from "./components/authentication/Login";
import RegisterPage from "./components/authentication/Register";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<h2>Hello world</h2>} />
        <Route path="/register" exact element={<RegisterPage/>} />
        <Route path="/login" exact element={<LoginPage/>} />
        <Route path="/forgotpwd" exact element={<ForgotPasswordPage/>} />
      </Routes>
    </>
  );
}

export default App;
