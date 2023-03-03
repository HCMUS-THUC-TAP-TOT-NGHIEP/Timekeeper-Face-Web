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

export const GetManyEmployee = async (requestData) => {
  var params = {
    Page: requestData.page,
    PerPage: requestData.perPage,
  };
  var response = await AxiosInstance.get("employee/many", {
    params: params,
  });
  return response.data;
};
