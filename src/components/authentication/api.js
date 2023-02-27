import axios from "axios";
import Config from "../../constant";
let AxiosInstance = axios.create({
  baseURL: Config.ServerApiUrl,
  timeout: Config.Timeout || 6000,
});

export const RegisterAccount = async (requestData) => {
  var bodyData = {
    email: requestData.email,
    password: requestData.password,
    firstName: requestData.firstName,
  };
  var response = await AxiosInstance.post("auth/register", bodyData);
  return response.data;
};

export const LoginAccount = async (requestData) => {
  var bodyData = {
    email: requestData.email,
    password: requestData.password,
  };
  var response = await AxiosInstance.post("auth/login", bodyData);
  return response.data;
};

export const RequestResetLink = async (requestData) => {
  var params = {
    email: requestData.email,
  };
  var response = await AxiosInstance.get("auth/request/reset-password", {
    params: params,
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
