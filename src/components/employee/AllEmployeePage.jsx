import axios from "axios";
import {
  DeleteOutlined,
  EditTwoTone,
  EyeTwoTone,
  FileExcelTwoTone,
  FilePdfTwoTone,
  FileWordTwoTone,
  InboxOutlined,
  LoadingOutlined,
  PaperClipOutlined,
  PictureTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import {
  faArrowsRotate,
  faFileImport,
  faInbox,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
  Upload,
  message,
  notification,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { compareDatetime, compareString } from "../../utils/Comparation";
import { DeleteOneEmployee, GetManyEmployee, ImportDataBE } from "./api";
import "./style.css";
import Paragraph from "antd/es/skeleton/Paragraph";
import { useAuthState } from "../../Contexts/AuthContext";

export const AllEmployeesPage = (props) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentEmployeeList, setCurrentEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notify, contextHolder] = notification.useNotification();
  const [total, setTotal] = useState(40);
  const navigate = useNavigate();
  const userDetails = useAuthState();

  useEffect(() => {
    loadData();
  }, [page, perPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      var response = await GetManyEmployee({ page, perPage });
      const { Status, Description, ResponseData } = response;
      if (Status === 1) {
        const { EmployeeList, Total } = ResponseData;
        setTotal(Total);
        setCurrentEmployeeList(EmployeeList);
        return;
      }
      notify.error({
        message: "Không thành công",
        description: Description,
      });
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
  };

  const deleteOneEmployee = (values) => {
    setCurrentEmployeeList(
      currentEmployeeList.filter((a) => a.Id !== values.Id)
    );
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "Id",
      key: "Id",
      width: 60,
      fixed: "left",
      sorter: (a, b) => a.Id - b.Id,
    },
    {
      title: "Họ tên",
      dataIndex: "FullName",
      key: "FullName",
      width: 200,
      fixed: "left",
      render: (_, employee) => `${employee.LastName} ${employee.FirstName}`,
      sorter: (a, b) =>
        compareString(a.FirstName + a.LastName, b.FirstName + b.LastName),
      // (a.FirstName + a.LastName).localeCompare(b.FirstName + b.LastName),
    },
    {
      title: "Ngày sinh",
      dataIndex: "DateOfBirth",
      key: "DateOfBirth",
      render: (_, { DateOfBirth }) =>
        DateOfBirth ? dayjs(DateOfBirth).format(Config.DateFormat) : "",
      width: 150,
    },
    {
      title: "Giới tính",
      dataIndex: "Gender",
      key: "Gender",
      render: (_, employee) => (employee.Gender ? "Nam" : "Nữ"),
      width: 80,
    },
    {
      title: "Vị trí công việc",
      dataIndex: "Position",
      key: "Position",
      width: "200px",
      sorter: (a, b) => String(a.Position).localeCompare(String(b.Position)),
      filters: [],
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Phòng ban",
      dataIndex: "DepartmentName",
      key: "DepartmentName",
      width: 100,
      sorter: (a, b) => compareString(a.DepartmentName, b.DepartmentName),
      // String(a.DepartmentId).localeCompare(String(b.DepartmentId)),
      filters: [
        {
          text: "HR - Nhân sự",
          value: "HR - Nhân sự",
        },
        {
          text: "FTS - Phòng Lập trình",
          value: "FTS - Phòng Lập trình",
        },
        {
          text: "Marketing",
          value: "Marketing",
        },
      ],
      onFilter: (value, record) => record.DepartmentId.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Ngày vào",
      dataIndex: "JoinDate",
      key: "JoinDate",
      render: (_, { JoinDate }) =>
        JoinDate ? dayjs(JoinDate).format(Config.DateFormat) : "",
      width: 150,
      sorter: (a, b) => compareDatetime(a, b),
    },
    {
      title: "Ngày nghỉ",
      dataIndex: "LeaveDate",
      key: "LeaveDate",
      render: (_, { LeaveDate }) =>
        LeaveDate ? dayjs(LeaveDate).format(Config.DateFormat) : "",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "Address",
      key: "Address",
      width: 200,
    },
    {
      title: "",
      dataIndex: "Action",
      key: "Action",
      render: (_, employee) => (
        <ActionMenu Employee={employee} deleteOneEmployee={deleteOneEmployee} />
      ),
      width: 150,
      // fixed: "right",
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
      <Row gutter={[16, 16]} wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Danh sách nhân viên
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/employee/all">Nhân viên</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space wrap>
            <Button
              type="primary"
              onClick={() => setPage(1)}
              icon={
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  style={{ paddingRight: "8px" }}
                  spin={loading}
                />
              }
              loading={loading}
              style={{
                backgroundColor: "#ec5504",
                border: "1px solid #ec5504",
              }}
            >
              Lấy lại dữ liệu
            </Button>
            <Button
              type="primary"
              icon={
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ paddingRight: "8px" }}
                />
              }
              onClick={() => navigate("/employee/add")}
            >
              Thêm nhân viên mới
            </Button>
            <ImportDataComponent notify={notify} />
          </Space>
        </Col>
      </Row>
      <Table
        bordered
        loading={loading}
        scroll={{
          x: 1500,
        }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        dataSource={currentEmployeeList}
        columns={columns}
        rowKey="Id"
        pagination={{
          onChange: (page, pageSize) => {
            setPage(page);
            setPerPage(pageSize);
          },
          hideOnSinglePage: true,
          total: total,
          pageSizeOptions: [10, 15, 25, 50],
          showSizeChanger: true,
        }}
      />
    </Space>
  );
};

// rowSelection object indicates the need for row selection

function ActionMenu(props) {
  const { Employee, deleteOneEmployee } = props;
  const [notify, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  return (
    <Space size="small">
      <Tooltip title="Xem">
        <Button
          type="text"
          icon={<EyeTwoTone />}
          onClick={() => navigate(`/employee/${Employee.Id}`)}
        />
      </Tooltip>
      <Tooltip title="Sửa">
        <Button
          type="text"
          icon={<EditTwoTone />}
          onClick={() => navigate(`/employee/edit/${Employee.Id}`)}
        />
      </Tooltip>
      <DeleteEmployee
        notify={notify}
        employee={Employee}
        deleteOneEmployee={deleteOneEmployee}
      />
      {contextHolder}
    </Space>
  );
}

const DeleteEmployee = (props) => {
  const { notify, employee, deleteOneEmployee } = props;
  const [loading, setLoading] = useState(false);
  const deleteEmployee = () => {
    setLoading(true);
    DeleteOneEmployee({ EmployeeId: employee.Id })
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          notification.success({
            description: "Xóa nhân viên thành công",
          });
          deleteOneEmployee(employee);
          return;
        }
        notification.error({
          title: "Xóa nhân viên Không thành công",
          description: Description,
        });
      })
      .catch((error) => {
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
      })
      .finally(function () {
        setLoading(false);
      });
  };

  return (
    <>
      <Popconfirm
        title={`Xóa nhân viên ID ${employee.Id}`}
        description={`Bạn có chắc muốn xóa nhân viên ID ${employee.Id} - ${employee.LastName} ${employee.FirstName} ?`}
        onConfirm={deleteEmployee}
        okText="Xóa"
        okButtonProps={{ danger: true, loading: loading }}
        cancelText="Hủy"
        placement="topRight"
      >
        <Tooltip title="Xóa">
          <Button type="text" icon={<DeleteOutlined />} danger></Button>
        </Tooltip>
      </Popconfirm>
    </>
  );
};

const ImportDataComponent = ({ notify, ...rest }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const userDetails = useAuthState();
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
    // onChange: ({ file, fileList, event }) => {
    //   console.log(file.originFileObj);
    //   console.log(fileList);
    //   console.log(event);
    // },
    // fileList,
    multiple: false,
    // action: `${Config.ServerApiUrl}/employee/import`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + userDetails.token,
    },
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
    // customRequest({
    //   action,
    //   data,
    //   file,
    //   filename,
    //   headers,
    //   onError,
    //   onProgress,
    //   onSuccess,
    //   withCredentials,
    // }) {
    //   // EXAMPLE: post form-data with 'axios'
    //   // eslint-disable-next-line no-undef
    //   const formData = new FormData();
    //   if (data) {
    //     console.log(data)
    //     Object.keys(data).forEach((key) => {
    //       formData.append(key, data[key]);
    //     });
    //   }
    //   formData.append(filename, file);

    //   axios
    //     .post(action, formData, {
    //       withCredentials,
    //       headers,
    //       onUploadProgress: ({ total, loaded }) => {
    //         onProgress(
    //           { percent: Math.round((loaded / total) * 100).toFixed(2) },
    //           file
    //         );
    //       },
    //     })
    //     .then(({ data: response }) => {
    //       onSuccess(response, file);
    //     })
    //     .catch(onError);

    //   return {
    //     abort() {
    //       console.log("upload progress is aborted.");
    //     },
    //   };
    // },
    // iconRender: handleIconRender(),
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
        <Upload.Dragger {...upLoadProps}>
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
          <p className="ant-upload-hint">Chập nhận file .xls, .xlxs</p>
        </Upload.Dragger>
        <div>
          <Typography.Paragraph>Lưu ý:</Typography.Paragraph>
          <Typography.Paragraph>
            <ul>
              <li>
                Để có kết quả nhập khẩu chính xác hãy sử dụng tệp mẫu.
                <Button type="link">Tải tệp mẫu</Button>
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

const handleIconRender = (file, listType) => {
  const fileSufIconList = [
    {
      type: <FilePdfTwoTone />,
      suf: [".pdf"],
    },
    {
      type: <FileExcelTwoTone />,
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
    // if (item.suf.includes(file.name.slice(file.name.lastIndexOf(".")))) {
    //   icon = item.type;
    // }
  });

  return icon;
};
