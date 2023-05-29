export const handleErrorOfRequest = ({ error, notify, ...rest }) => {
  try {
    console.log(error)
    if (error.code === "ECONNABORTED") {
      notify.error({
        message:
          "Không nhận được phản hồi của máy chủ. Hãy kiểm tra lại kết nối Internet.",
      });
    }
    if (error.response) {
      notify.error({
        message: "Có lỗi ở response.",
        description: `[${error.response.statusText}]`,
      });
    } else if (error.request) {
      notify.error({
        message: "Có lỗi ở request.",
        description: error,
      });
    } else {
      notify.error({
        message: "Có lỗi ở máy khách",
        description: error.message,
      });
    }
  } catch (error) {
    console.error(error.message);
  }
};
