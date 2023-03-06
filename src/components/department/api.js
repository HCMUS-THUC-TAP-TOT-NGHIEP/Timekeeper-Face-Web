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

export const GetDepartmentList = async (requestData) => {
  const params = requestData;
  const accessToken = localStorage.getItem("access_token");
  var response = await AxiosInstance.get("department/list", {
    params,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken
    },
  });
  return response.data;
};
