var Config = {
  ServerApiUrl: process.env.REACT_APP_SERVER_API_URL,
  Timeout: 6000,
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm:ss",
  timestampFormat: "DD/MM/YYYY HH:mm:ss",
  passwordPattern: "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{0,}$",
};

export default Config;
