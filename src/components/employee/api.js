import axios from "axios";
import Config from "../../constant";
let AxiosInstance = axios.create({
  baseURL: Config.ServerApiUrl,
  timeout: Config.Timeout || 6000,
  headers: {
    // "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
});

export const GetManyEmployee = async (
  method = "GET",
  { page, perPage, searchString, department, ...rest }
) => {
  console.log("requestData", { page, perPage, searchString, department });
  var params = {
    Page: page || 1,
    PerPage: perPage || 10,
    SearchString: searchString,
  };
  var access_token = localStorage.getItem("access_token");
  var response = {};
  if (method === "POST") {
    var req = {
      Department: department,
    };
    response = await AxiosInstance.post("employee/many", req, {
      params: params,
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });
    return response.data;
  }
  response = await AxiosInstance.get("employee/many", {
    params: params,
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const GetOneEmployeeInfo = async (requestData) => {
  var params = {
    Id: requestData.employeeId,
  };
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.get("employee/", {
    params: params,
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const ModifyEmployeeInfo = async (requestData) => {
  var bodyData = requestData;
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.put("employee/update", bodyData, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const AddNewEmployee = async (requestData) => {
  var bodyData = requestData;
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.post("employee/create", bodyData, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const DeleteOneEmployee = async (requestData) => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.delete("employee/", {
    data: requestData,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const ImportDataBE = async ({ fileList, ...rest }) => {
  var formData = new FormData();
  console.log(fileList[0].arrayBuffer());
  formData.append("ImportData", fileList[0], fileList[0].name);
  formData.append("Type", fileList[0].type);
  formData.append("Target", "Employee");

  var response = await AxiosInstance.post("employee/import", formData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const GetTemplateFile = async (req) => {
  var response = await AxiosInstance.get("employee/import/templates", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    responseType: "blob",
  });
  return response.data;
};
