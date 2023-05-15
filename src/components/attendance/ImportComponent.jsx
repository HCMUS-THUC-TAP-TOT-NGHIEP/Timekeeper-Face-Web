import {
  FilePdfTwoTone,
  FileWordTwoTone,
  PictureTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import { faFileExcel, faInbox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Typography, Upload } from "antd";
import React, { useState } from "react";
import { useAuthState } from "../../Contexts/AuthContext";
import { GetTemplateFile, ImportDataBE } from "./api";

const ImportTimekeeperData = ({ notify, ...rest }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const userDetails = useAuthState();

  const loadTemplate = async () => {
    try {
      var fileData = await GetTemplateFile({
        fileName: "TimekeeperDataTemplate",
      });
      var url = window.URL.createObjectURL(fileData);
      console.log(url);
      var link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "TimekeeperData");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      // fileDownload(response, "Employee.xlsx")
    } catch (error) {
      console.error(error);
      if (error.response) {
        var status = error.response.status;
        if (status === 400) {
          notify.error({
            message: "Không thành công",
            description: error.response,
          });
          return;
        }
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
    } finally {
    }
  };

  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };
  const importFile = async () => {
    try {
      var response = await ImportDataBE({ fileList });
      console.log("response", response);
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  };

  const upLoadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: async (file) => {
      console.log(file);
      console.log(file instanceof File);
      file
        .arrayBuffer()
        .then((response) => {
          console.log("arrayBuffer", response);
        })
        .catch((error) => {
          console.log("arrayBuffer", error);
        });
      setFileList([file]);
      return false;
    },
    multiple: false,
    onStart(file) {
      console.log("onStart", file, file.name);
    },
    onSuccess(res, file) {
      console.log("onSuccess", res, file.name);
    },
    onError(err) {
      console.log("onError", err);
    },
    onProgress({ percent }, file) {
      console.log("onProgress", `${percent}%`, file.name);
    },
    fileList,
  };

  return (
    <>
      <Button onClick={showModal} icon={<UploadOutlined />}>
        Tải lên
      </Button>
      <Modal
        title="Tải lên"
        open={open}
        onOk={hideModal}
        onCancel={hideModal}
        destroyOnClose={true}
        footer={[
          <Button key="1" type="default" onClick={hideModal}>
            Huỷ
          </Button>,
          <Button
            key="2"
            type="primary"
            onClick={importFile}
            loading={loading}
            disabled={fileList.length == 0}
          >
            Import
          </Button>,
        ]}
      >
        <Upload.Dragger
          {...upLoadProps}
          iconRender={handleIconRender}
          listType="picture-card"
        >
          <p className="ant-upload-drag-icon">
            <FontAwesomeIcon
              icon={faInbox}
              size="5x"
              style={{ color: "#0084ff" }}
            />
          </p>
          <Typography.Title level={2} className="ant-upload-text">
            Kéo thả tệp vào đây
          </Typography.Title>
          <p className="ant-upload-hint">Chấp nhận file .xls, .xlsx</p>
        </Upload.Dragger>
        <div>
          <Typography.Paragraph>Lưu ý:</Typography.Paragraph>
          <Typography.Paragraph>
            <ul>
              <li>
                Để có kết quả nhập khẩu chính xác hãy sử dụng tệp mẫu.
                <Button type="link" onClick={loadTemplate}>
                  Tải tệp mẫu
                </Button>
              </li>
              <li>
                Mỗi dòng dữ liệu trong tệp nhập khẩu tương ứng với một bản ghi.
              </li>
            </ul>
          </Typography.Paragraph>
        </div>
      </Modal>
    </>
  );
};

const handleIconRender = (file) => {
  const fileSufIconList = [
    {
      type: <FilePdfTwoTone />,
      suf: [".pdf"],
    },
    {
      type: (
        <FontAwesomeIcon
          icon={faFileExcel}
          size="2x"
          style={{ color: "#1d6f42" }}
        />
      ),
      // type: <FileExcelTwoTone/>,
      suf: [".xlsx", ".xls", ".csv"],
    },
    {
      type: <FileWordTwoTone />,
      suf: [".doc", ".docx"],
    },
    {
      type: <PictureTwoTone />,
      suf: [
        ".webp",
        ".svg",
        ".png",
        ".gif",
        ".jpg",
        ".jpeg",
        ".jfif",
        ".bmp",
        ".dpg",
      ],
    },
  ];
  // console.log(1, file, listType);
  let icon;
  fileSufIconList.forEach((item) => {
    if (item.suf.includes(file.name.slice(file.name.lastIndexOf(".")))) {
      icon = item.type;
    }
  });

  return icon;
};

export { ImportTimekeeperData };
