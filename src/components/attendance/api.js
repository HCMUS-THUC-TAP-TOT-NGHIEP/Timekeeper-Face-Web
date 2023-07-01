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

  var response = await AxiosInstance.post(
    "checkin/timekeeper/import",
    formData,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const GetTimesheetList = async (req) => {
  const response = await AxiosInstance.get("checkin/timesheet", {
    params: {
      Page: req.Page,
      PageSize: req.PageSize,
      Keyword: req.Keyword,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const GetTimesheetDetail = async (req) => {
  const response = await AxiosInstance.get("checkin/timesheet/detail", {
    params: {
      Id: req.Id,
      SearchString: req.SearchString,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const CreatTimesheetBE = async (req) => {
  var requestData = {
    Name: req.Name,
    DateFrom: req.DateRange[0] ? req.DateRange[0].format("YYYY-MM-DD") : "",
    DateTo: req.DateRange[1] ? req.DateRange[1].format("YYYY-MM-DD") : "",
    DepartmentList: (req.DepartmentList || []).filter((x) => x !== 0),
  };
  var response = await AxiosInstance.post("checkin/timesheet", requestData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });
  return response.data;
};

export const UpdateTimesheetBE = async (Id) => {
  let req = { Id: Id };
  let response = await AxiosInstance.put("checkin/timesheet", req, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });
  return response.data;
};

export const DeleteTimesheetBE = async ({ Id }) => {
  let req = { Id: Id };
  console.log(localStorage.getItem("access_token"));
  let response = await AxiosInstance.delete("checkin/timesheet", {
    data: req,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });
  return response.data;
};

export const ExportTimesheetBE = async ({ Id }) => {
  var requestData = {
    Id: Id,
  };
  var response = await AxiosInstance.post(
    "checkin/timesheet/report",
    requestData,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      timeout: 60 * 1000,
      responseType: "blob",
    }
  );
  return response.data;
};

export const ExportAttendanceStatisticBE = async (req) => {
  var requestData = {
    DateFrom: req.DateFrom,
    DateTo: req.DateTo,
    Keyword: req.Keyword,
  };
  var response = await AxiosInstance.post("checkin/report", requestData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    timeout: 60 * 1000,
    responseType: "blob",
  });
  return response.data;
};

export const UpdateTimesheetDetail = async (request) => {
  let response = await AxiosInstance.put("checkin/timesheet/detail", request, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });
  return response.data;
};
export const ImportDataTimesheetDataBE = async ({
  fileList,
  timesheetId,
  ...rest
}) => {
  var formData = new FormData();
  formData.append("ImportData", fileList[0], fileList[0].name);
  formData.append("Type", fileList[0].type);
  formData.append("Target", "TimesheetData");
  formData.append("TimesheetId", timesheetId);

  var response = await AxiosInstance.post(
    "checkin/timesheet/import",
    formData,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "multipart/form-data",
      },
      timeout: 60 * 1000,
    }
  );
  return response.data;
};

export const GetAllCheckinMethods = async () => {
  var res = await AxiosInstance.get("/checkin/method", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });
  return res.data;
};
