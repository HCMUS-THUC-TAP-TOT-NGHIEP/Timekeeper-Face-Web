import axios from "axios";
import Config from "../../constant";
let AxiosInstance = axios.create({
  baseURL: Config.ServerApiUrl,
  timeout: Config.Timeout || 6000,
});

export const RegisterAccount = async (requestData) => {
  var bodyData = {
    email: requestData.email,
    password: requestData.password,
    firstName: requestData.firstName,
  };
  var response = await AxiosInstance.post("auth/register", bodyData);
//   console.log(response.data);
  return response.data;
};
