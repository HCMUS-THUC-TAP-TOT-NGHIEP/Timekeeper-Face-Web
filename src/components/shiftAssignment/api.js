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

export const GetAssignmentList = async () => {
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.get("shift/assignment/list", {
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

export const GetShiftList = async () => {
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.get("shift/list", {
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

export const _TargeType = {
  ByDepartment: 1,
  ByEmployee: 2,
};