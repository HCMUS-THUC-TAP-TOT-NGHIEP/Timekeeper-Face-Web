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

export const LoginAccount2 = async (dispatch, requestData) => {
  var bodyData = {
    email: requestData.email,
    password: requestData.password,
  };
  try {
    dispatch({ type: "REQUEST_LOGIN" });
    var response = await AxiosInstance.post("auth/login", bodyData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    var { Status, ResponseData, Description } = response.data;
    if (Status === 1) {
      dispatch({ type: "LOGIN_SUCCESS", payload: ResponseData });
      localStorage.setItem("access_token", ResponseData.access_token);
    } else {
      dispatch({ type: "LOGIN_ERROR", error: Description });
    }
    return response.data;
  } catch (error) {
    dispatch({ type: "LOGIN_ERROR", error: error });
    throw error;
  }
};

export const Logout2 = async (dispatch, access_token) => {
  dispatch({ type: "LOGOUT" });
  var response = await AxiosInstance.post("auth/logout", null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};