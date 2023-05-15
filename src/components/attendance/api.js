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
