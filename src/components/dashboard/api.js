import axios from "axios";
import Config from "../../constant";
let AxiosInstance = axios.create({
  baseURL: Config.ServerApiUrl,
  timeout: Config.Timeout || 6000,
});

export const getUserInfo = async () => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.get("/user", {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};
