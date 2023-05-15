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

export const GetStatistic = async (requestData) => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.post("checkin/list", requestData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const GetStatisticV2 = async (requestData) => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.post("checkin/list/v2", requestData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const GetTemplateFile = async (req) => {
  var response = await AxiosInstance.get("checkin/timekeeper/templates", {
    params: { FileName: req.fileName },
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    responseType: "blob",
  });
  return response.data;
};

export const ImportDataBE = async ({ fileList, ...rest }) => {
  var formData = new FormData();
  console.log(fileList[0].arrayBuffer());
  formData.append("ImportData", fileList[0], fileList[0].name);
  formData.append("Type", fileList[0].type);
  formData.append("Target", "TimekeeperData");

  var response = await AxiosInstance.post("checkin/timekeeper/import", formData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
