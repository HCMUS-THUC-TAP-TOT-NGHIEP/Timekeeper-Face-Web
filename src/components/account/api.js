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

export const GetAccountList = async (req = null) => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.post("user/list", req || {}, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const AddNewUser = async (req) => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.post("user/add", req, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const DeleteUser = async (req) => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.delete("user/delete", {
    data: req,
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const UpdateUser = async (req) => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.put("user/update", req, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const GetUserRoleList = async () => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.get("user/role", {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const CheckAuthorization = async ({ MenuName, Permissions }) => {
  var response = await AxiosInstance.get("/user/authorization", {
    params: {
      Target: MenuName,
      Permissions: Permissions || [],
    },
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });
  return response.data;
};
