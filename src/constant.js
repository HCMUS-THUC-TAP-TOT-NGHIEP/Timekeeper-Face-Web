var Config = {
  ServerApiUrl: process.env.REACT_APP_SERVER_API_URL,
  Timeout: 6000,
  DateFormat: "DD - MM - YYYY",
  TimeFormat: "HH:mm:ss",
  NonSecondFormat: "HH:mm",
  TimestampFormat: "DD/MM/YYYY HH:mm:ss",
  PasswordPattern: "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{0,}$",
};

export default Config;
