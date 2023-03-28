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

export const DeleteShift = async(req) =>{
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.delete("shift/", {
    data: req,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;

}

export const UpdateShift = async (req) =>
{
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.put("shift/update", req, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;

}