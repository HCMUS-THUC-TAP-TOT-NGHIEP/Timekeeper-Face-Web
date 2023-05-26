var Config = {
  ServerApiUrl: process.env.REACT_APP_SERVER_API_URL,
  DateFormat: "DD/MM/YYYY",
  TimeFormat: "HH:mm:ss",
  NonSecondFormat: "HH:mm",
  TimestampFormat: "DD/MM/YYYY HH:mm:ss",
  PasswordPattern: "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{0,}$",
  Timeout: (process.env.REACT_APP_CONNECTION_TIMEOUT_BY_SECOND || 6) * 1000,
};

export default Config;
