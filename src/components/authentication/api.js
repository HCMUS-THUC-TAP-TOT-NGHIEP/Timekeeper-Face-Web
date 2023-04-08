import axios from "axios";
import Config from "../../constant";
let AxiosInstance = axios.create({
  baseURL: Config.ServerApiUrl,
  timeout: Config.Timeout || 6000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
});

export const RegisterAccount = async (requestData) => {
  var response = await AxiosInstance.post("auth/register", requestData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  return response.data;
};

export const LoginAccount = async (requestData) => {
  var bodyData = {
    email: requestData.email,
    password: requestData.password,
  };
  var response = await AxiosInstance.post("auth/login", bodyData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  return response.data;
};

export const RequestResetLink = async (requestData) => {
  var params = {
    email: requestData.email,
  };
  var response = await AxiosInstance.get("auth/request/reset-password", {
    params: params,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  return response.data;
};

export const ResetPassword = async (requestData) => {
  var bodyData = {
    access_token: requestData.access_token,
    new_password: requestData.new_password,
  };
  var response = await AxiosInstance.post("auth/reset_password", bodyData);
  return response.data;
};

export const Logout = async (access_token) => {
  var response = await AxiosInstance.post("auth/logout", null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const changePasswordBE = async (req) => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.post("auth/changepwd", req, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};
