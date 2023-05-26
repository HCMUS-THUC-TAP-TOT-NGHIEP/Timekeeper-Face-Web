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

export const GetShiftList = async (requestData) => {
  const params = requestData;
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.get("shift/list", {
    params,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

export const GetShiftTypeList = async () => {
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.get("shift/type/list", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

export const CreateNewShift = async (req) => {
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.post("shift/create", req, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

export const DeleteShift = async (req) => {
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.delete("shift/", {
    data: req,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

export const UpdateShift = async (req) => {
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.put("shift/update", req, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

export const AssignShift = async (req) => {
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.post("shift/assignment", req, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

export const GetAssignmentList = async (req) => {
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.get("shift/assignment/list", {
    params: req,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

export const GetAssignmentDetail = async (req) => {
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.post("shift/assignment/detail", req, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

export const GetAssignmentType = async () => {
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.get("shift/assignment/all-type", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

export const GetDesignationList = async (accessToken) => {
  var response = await AxiosInstance.get("designation/list", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

export const UpdateShiftAssignment = async (req) => {
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.post("shift/assignment/update", req, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

export const GetShiftDetail = async ({Id, ...rest}) => {
  var response = await AxiosInstance.get("shift/detail", {
    params: {Id: Id},
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("access_token")
    },
  });
  return response.data;

}

export const _TargeType = {
  ByEmployee: 1,
  ByDepartment: 2,
};
