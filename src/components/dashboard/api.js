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

export const GetEarlyLateCount = async ({ DateFrom, DateTo }) => {
  let response = await AxiosInstance.post(
    "checkin/late-early/count",
    { DateFrom, DateTo },
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    }
  );
  return response.data;
};

export const GetOffCount = async ({ DateFrom, DateTo }) => {
  let response = await AxiosInstance.post(
    "checkin/off/count",
    { DateFrom, DateTo },
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    }
  );
  return response.data;
};
