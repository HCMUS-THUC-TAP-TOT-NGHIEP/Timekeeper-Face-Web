import {
  CloseOutlined,
  DeleteFilled,
  DeleteOutlined,
  EditTwoTone,
  FilterFilled,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  TimePicker,
  Tooltip,
  notification,
} from "antd";
import { Content } from "antd/es/layout/layout";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import Config from "../../constant";
import { compareDatetime, compareString } from "../../utils";
import { AddShift } from "./AddShift";
import { DeleteShift, GetShiftList, UpdateShift } from "./api";

const ShiftList = function (props) {
  const [loading, setLoading] = useState(true);
  const [currentShiftList, setCurrentShiftList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { notify } = props;

  useEffect(() => {
    document.title = "Ca làm việc";
  }, []);
  useEffect(() => {
    GetShiftList()
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          for (var i = 0; i < ResponseData.length; i++) {
            ResponseData[i].key = i;
          }
          setCurrentShiftList(ResponseData);
          return;
        }
        notify.error({
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
      .finally(() => {
        setLoading(false);
      });
  }, [perPage, page, notify]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterFilled
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(
          () => (searchInput.current ? searchInput.current.input : undefined),
          100
        );
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const updateOneShift = (value) => {
    const newCurrentShiftList = currentShiftList.map((shift) => {
      if (shift.Id === value.Id) {
        value.key = value.Id;
        return value;
      } else {
        return shift;
      }
    });
    setCurrentShiftList(newCurrentShiftList);
  };
  const insertOneShift = (value) => {
    if (currentShiftList.length < perPage)
      setCurrentShiftList([...currentShiftList, value]);
  };
  const deleteOneShift = (value) => {
    setCurrentShiftList(
      currentShiftList.filter((shift) => shift.Id !== value.Id)
    );
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/shift-list">Ca làm việc</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <AddShift
            insertOneShiftFE={insertOneShift}
            notify={notify}
            currentShiftList={currentShiftList}
          />
        </Col>
      </Row>
      <Content>
        <Table
          loading={loading}
          bordered
          scroll={{
            x: 900,
          }}
          style={{ borderColor: "black" }}
          dataSource={currentShiftList}
          //columns={columns}
        >
          {/* <Column
            title="Mã"
            dataIndex="Id"
            key="Id"
            sorter={(a, b) => a.Id - b.Id}
            fixed="left"
            width={50}
            {...getColumnSearchProps("Id")}
          /> */}
          <Column
            title="Mô tả"
            dataIndex="Description"
            key="Description"
            sorter={(a, b) => compareString(a, b, "Description")}
            width={50}
            {...getColumnSearchProps("Description")}
          />
          <Column
            title="Ngày bắt đầu"
            dataIndex="StartDate"
            key="StartDate"
            render={
              (_, { StartDate }) => (
                <p>dayjs(StartDate).format(Config.DateFormat)</p>
              )
              //   {
              //   if (record.StartDate) {
              //     return dayjs(record.StartDate).format(Config.DateFormat);
              //   }
              //   return <p></p>;
              // }
            }
            width={50}
            {...getColumnSearchProps("StartDate")}
          />
          <Column
            title="Ngày kết thúc"
            dataIndex="EndDate"
            key="EndDate"
            render={
              (_, { EndDate }) => (
                <Space>{dayjs(EndDate).format(Config.DateFormat)}</Space>
              )
              //   {
              //   if (record.StartDate) {
              //     return dayjs(record.StartDate).format(Config.DateFormat);
              //   }
              //   return <p></p>;
              // }
            }
            width={50}
            {...getColumnSearchProps("StartDate")}
          />

          <Column
            title="Giờ vào"
            dataIndex="StartTime"
            key="StartTime"
            render={(_, record) => {
              var time = dayjs(record.StartTime, Config.TimeFormat);
              console.log("record.StartTime", time);
              if (record.StartTime) {
                // return record.StartTime;
                // var time = dayjs(record.StartTime, Config.TimeFormat);
                console.log(
                  "record.StartTime",
                  time.format(Config.NonSecondFormat)
                );
                return <p>{time.format(Config.NonSecondFormat)}</p>;
              }
              return <p></p>;
            }}
            width={50}
            sorter={(a, b) => compareDatetime(a, b, "StartTime")}
            {...getColumnSearchProps("StartTime")}
          />
          <Column
            title="Giờ ra"
            dataIndex="FinishTime"
            key="FinishTime"
            render={(_, { FinishTime }) => {
              if (FinishTime) {
                return FinishTime;
              }
              return "";
            }}
            width={50}
            sorter={(a, b) => compareDatetime(a, b, "FinishTime")}
            {...getColumnSearchProps("FinishTime")}
          />
          <Column
            title="Giờ nghỉ"
            dataIndex="BreakAt"
            key="BreakAt"
            render={(_, { BreakAt }) => {
              if (BreakAt) {
                return BreakAt;
              }
              return "";
            }}
            width={50}
            sorter={(a, b) => compareDatetime(a, b, "BreakAt")}
            {...getColumnSearchProps("BreakAt")}
          />
          <Column
            title="Kết thúc nghỉ"
            dataIndex="BreakEnd"
            key="BreakEnd"
            render={(_, { BreakEnd }) => {
              if (BreakEnd) {
                return BreakEnd;
              }
              return "";
            }}
            width={50}
            sorter={(a, b) => compareDatetime(a, b, "BreakEnd")}
            {...getColumnSearchProps("BreakEnd")}
          />
          <Column
            title="Số giờ làm"
            dataIndex="Số giờ làm"
            key="Số giờ làm"
            render={(_, record) => {
              var minutes = 0;
              if (record.StartTime && record.FinishTime) {
                var time0 = dayjs(record.StartTime, Config.TimeFormat);
                var time1 = dayjs(record.FinishTime, Config.TimeFormat);
                if (record.BreakAt && record.BreakEnd) {
                  var time2 = dayjs(record.BreakAt, Config.TimeFormat);
                  var time3 = dayjs(record.BreakEnd, Config.TimeFormat);
                  minutes =
                    time1.diff(time0, "minutes") - time3.diff(time2, "minutes");
                } else {
                  minutes = time1.diff(time0, "minutes");
                }
              }
              return `${(minutes - (minutes % 60)) / 60} giờ ${
                minutes % 60
              } phút`;
            }}
            width={80}
          />
          <Column
            title=""
            dataIndex="actions"
            key="actions"
            render={(_, shift) => (
              <ActionMenu
                shift={shift}
                setShiftList={setCurrentShiftList}
                shiftList={currentShiftList}
                updateOneShift={updateOneShift}
                deleteOneShift={deleteOneShift}
              />
            )}
            width={100}
          />
        </Table>
      </Content>
    </Space>
  );
};

// const AddShiftForm = (props) => {
//   const form = props.form;
//   const [insertOneShift, currentShiftList] = props.listState;
//   const [notify, contextHolder] = notification.useNotification();

//   const onSubmit = (values) => {
//     const patternTime = "HH:mm:ss";
//     values.StartTime = dayjs(values.StartTime).format(patternTime);
//     values.FinishTime = dayjs(values.FinishTime).format(patternTime);
//     if (values.BreakAt) {
//       values.BreakAt = dayjs(values.BreakAt).format(patternTime);
//     }
//     if (values.BreakEnd) {
//       values.BreakEnd = dayjs(values.BreakEnd).format(patternTime);
//     }
//     CreateNewShift(values)
//       .then((response) => {
//         const { Status, Description, ResponseData } = response;
//         if (Status === 1) {
//           notification.success({
//             description: "Ca làm việc mới đã được tạo",
//           });
//           values.Id = ResponseData.Id;
//           insertOneShift(values);
//           return;
//         }
//         notification.error({
//           message: "Không thành công",
//           description: Description,
//         });
//       })
//       .catch((error) => {
//         if (error.response) {
//           notify.error({
//             message: "Có lỗi ở response.",
//             description: `[${error.response.statusText}]`,
//           });
//         } else if (error.request) {
//           notify.error({
//             message: "Có lỗi ở request.",
//             description: error,
//           });
//         } else {
//           notify.error({
//             message: "Có lỗi ở máy khách",
//             description: error.message,
//           });
//         }
//       });
//   };
//   return (
//     <Form
//       style={{ width: "100%", maxWidth: "600px" }}
//       form={form}
//       name="basic"
//       labelCol={{
//         span: 8,
//       }}
//       onFinish={onSubmit}
//       autoComplete="off"
//       layout="vertical"
//     >
//       {contextHolder}
//       <Row
//         gutter={{
//           xs: 8,
//           sm: 16,
//           md: 24,
//           lg: 32,
//         }}
//       >
//         <Col xs={24}>
//           <Form.Item
//             hasFeedback
//             labelCol={24}
//             label="Tên hoặc mô tả"
//             name="Description"
//             rules={[
//               {
//                 required: true,
//                 message: "Mô tả là trường bắt buộc.",
//               },
//               {
//                 validator: (_, value) => {
//                   var exist = currentShiftList.find(
//                     (shift) => shift.Description == value
//                   );
//                   if (!exist) return Promise.resolve();
//                   return Promise.reject(
//                     new Error(`${value} đã có trong danh mục ca làm việc.`)
//                   );
//                 },
//               },
//             ]}
//           >
//             <Input placeholder="Nhập tên hoặc mô tả ca làm việc" />
//           </Form.Item>
//         </Col>
//         <Col xs={24} sm={24} md={12} lg={12}>
//           <Form.Item
//             hasFeedback
//             labelCol={24}
//             label="Giờ vào"
//             name="StartTime"
//             rules={[
//               {
//                 required: true,
//                 message: "Giờ vào là trường bắt buộc.",
//               },
//             ]}
//           >
//             <TimePicker
//               minuteStep={15}
//               style={{ width: "100%" }}
//               placeholder="Chọn giờ vào"
//               format={Config.NonSecondFormat}
//             />
//           </Form.Item>
//         </Col>
//         <Col xs={24} sm={24} md={12} lg={12}>
//           <Form.Item
//             hasFeedback
//             labelCol={24}
//             label="Giờ ra"
//             name="FinishTime"
//             rules={[
//               {
//                 required: true,
//                 message: "Giờ ra là trường bắt buộc.",
//               },
//             ]}
//           >
//             <TimePicker
//               minuteStep={15}
//               style={{ width: "100%" }}
//               placeholder="Chọn giờ ra"
//               format={Config.NonSecondFormat}
//             />
//           </Form.Item>
//         </Col>
//         <Col xs={24} sm={24} md={12} lg={12}>
//           <Form.Item
//             hasFeedback
//             labelCol={24}
//             label="Giờ nghỉ"
//             name="BreakAt"
//             // rules={[]}
//           >
//             <TimePicker
//               minuteStep={15}
//               style={{ width: "100%" }}
//               placeholder="Chọn giờ nghỉ"
//               format={Config.NonSecondFormat}
//             />
//           </Form.Item>
//         </Col>
//         <Col xs={24} sm={24} md={12} lg={12}>
//           <Form.Item
//             hasFeedback
//             labelCol={24}
//             label="Giờ kết thúc nghỉ"
//             name="BreakEnd"
//             // rules={[]}
//           >
//             <TimePicker
//               minuteStep={15}
//               style={{ width: "100%" }}
//               placeholder="Chọn giờ kết thúc nghỉ"
//               format={Config.NonSecondFormat}
//             />
//           </Form.Item>
//         </Col>
//       </Row>
//     </Form>
//   );
// };

function ActionMenu(props) {
  const [form] = Form.useForm();
  const { shift, setShiftList, shiftList, updateOneShift } = props;
  const [notify, contextHolder] = notification.useNotification();

  const deleteShift = () => {
    DeleteShift({ IdList: [shift.Id] })
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          notification.success({
            description: `Đã xóa ${shift.Id} - ${shift.Description}`,
          });
          setShiftList(shiftList.filter((a) => a.Id !== shift.Id));
          return;
        }
        notification.error({
          message: "Không thành công",
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
      });
  };
  const showEditForm = () => {
    Modal.confirm({
      title: "Chỉnh sửa ca làm việc",
      icon: <EditTwoTone />,
      closeIcon: <CloseOutlined />,
      content: (
        <EditShiftFrom
          form={form}
          content={shift}
          listState={[updateOneShift, shiftList]}
        />
      ),
      cancelText: "Hủy",
      okText: "Cập nhật",
      onOk() {
        form.submit();
        setTimeout(() => {}, 10000);
      },
      closable: true,
      width: 600,
    });
  };

  return (
    <Space align="center" size="middle" wrap>
      {contextHolder}
      <Space
        size="middle"
        onClick={showEditForm}
        style={{ padding: 4, margin: 1, cursor: "pointer" }}
      >
        <Tooltip title="Chỉnh sửa">
          <Button type="text" shape="circle" icon={<EditTwoTone />} />
        </Tooltip>
      </Space>
      <Popconfirm
        title={`Xóa ca làm việc ID ${shift.Id}`}
        description={`Bạn có chắc muốn xóa ID ${shift.Id} - ${shift.Description}?`}
        okText="Xóa"
        okType="danger"
        cancelText="Hủy"
        placement="topLeft"
        onConfirm={deleteShift}
        icon={<DeleteFilled />}
      >
        <Tooltip title="Xóa">
          <Button type="text" shape="circle" icon={<DeleteOutlined />} danger />
        </Tooltip>
      </Popconfirm>
    </Space>
  );
}

const EditShiftFrom = (props) => {
  const form = props.form;
  const shift = props.content;
  const [updateOneShift, shiftList] = props.listState;
  const timePattern = "HH:mm:ss";
  const [notify, contextHolder] = notification.useNotification();

  useEffect(() => {
    form.setFieldsValue({
      Id: shift.Id,
      Description: shift.Description,
      StartTime: dayjs(shift.StartTime, timePattern),
      FinishTime: dayjs(shift.FinishTime, timePattern),
    });
    if (shift.BreakAt)
      form.setFieldsValue({ BreakAt: dayjs(shift.BreakAt, timePattern) });
    if (shift.BreakEnd)
      form.setFieldsValue({ BreakEnd: dayjs(shift.BreakEnd, timePattern) });
  }, [shift, form]);
  const onSubmit = (values) => {
    values.StartTime = dayjs(values.StartTime).format(timePattern);
    values.FinishTime = dayjs(values.FinishTime).format(timePattern);
    if (values.BreakAt) {
      values.BreakAt = dayjs(values.BreakAt).format(timePattern);
    }
    if (values.BreakEnd) {
      values.BreakEnd = dayjs(values.BreakEnd).format(timePattern);
    }
    UpdateShift(values)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          notification.success({
            description: "Chỉnh sửa thành công",
          });
          updateOneShift(values);
          return;
        }
        notification.error({
          message: "Có lỗi",
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
      });
  };
  return (
    <Form
      style={{ width: "100%", maxWidth: "600px" }}
      form={form}
      name="basic"
      labelCol={{
        span: 8,
      }}
      onFinish={onSubmit}
      autoComplete="off"
      layout="vertical"
      preserve={false}
    >
      {contextHolder}
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
      >
        <Col xs={24}>
          <Form.Item
            hasFeedback
            labelCol={24}
            label="Mã"
            name="Id"
            rules={[
              {
                required: true,
                message: "Mã là trường bắt buộc.",
              },
            ]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            hasFeedback
            labelCol={24}
            label="Tên hoặc mô tả"
            name="Description"
            rules={[
              {
                required: true,
                message: "Mô tả là trường bắt buộc.",
              },
              {
                validator: (_, value) => {
                  var exist = shiftList.find(
                    (s) => s.Description == value.trim() && s.Id != shift.Id
                  );
                  if (!exist) return Promise.resolve();
                  return Promise.reject(
                    new Error(`${value} đã có trong danh mục ca làm việc.`)
                  );
                },
              },
            ]}
          >
            <Input placeholder="Nhập tên hoặc mô tả ca làm việc" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            hasFeedback
            labelCol={24}
            label="Giờ vào"
            name="StartTime"
            rules={[
              {
                required: true,
                message: "Giờ vào là trường bắt buộc.",
              },
            ]}
          >
            <TimePicker
              minuteStep={15}
              style={{ width: "100%" }}
              placeholder="Chọn giờ vào"
              format={Config.NonSecondFormat}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            hasFeedback
            labelCol={24}
            label="Giờ ra"
            name="FinishTime"
            rules={[
              {
                required: true,
                message: "Giờ ra là trường bắt buộc.",
              },
            ]}
          >
            <TimePicker
              minuteStep={15}
              style={{ width: "100%" }}
              placeholder="Chọn giờ ra"
              format={Config.NonSecondFormat}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item hasFeedback labelCol={24} label="Giờ nghỉ" name="BreakAt">
            <TimePicker
              minuteStep={15}
              style={{ width: "100%" }}
              placeholder="Chọn giờ nghỉ"
              format={Config.NonSecondFormat}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            hasFeedback
            labelCol={24}
            label="Giờ kết thúc nghỉ"
            name="BreakEnd"
          >
            <TimePicker
              minuteStep={15}
              style={{ width: "100%" }}
              placeholder="Chọn giờ kết thúc nghỉ"
              format={Config.NonSecondFormat}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export { ShiftList };

// const columns = [
//   {
//     title: "Mã",
//     dataIndex: "Id",
//     key: "Id",
//     sorter: (a, b) => a.Id - b.Id,
//     fixed: "left",
//     width: 50,
//     ...getColumnSearchProps("Id"),
//   },
//   {
//     title: "Mô tả",
//     dataIndex: "Description",
//     key: "Description",
//     sorter: (a, b) => compareString(a, b, "Description"),
//     width: 50,
//     ...getColumnSearchProps("Description"),
//   },
//   {
//     title: "Giờ vào",
//     dataIndex: "StartTime",
//     key: "StartTime",
//     render: (_, { StartTime }) => {
//       if (StartTime) {
//         return StartTime;
//       }
//       return "";
//     },
//     width: 50,
//     sorter: (a, b) => compareDatetime(a, b, "StartTime"),
//     ...getColumnSearchProps("StartTime"),
//   },
//   {
//     title: "Giờ ra",
//     dataIndex: "FinishTime",
//     key: "FinishTime",
//     render: (_, { FinishTime }) => {
//       if (FinishTime) {
//         return FinishTime;
//       }
//       return "";
//     },
//     width: 50,
//     sorter: (a, b) => compareDatetime(a, b, "FinishTime"),
//     ...getColumnSearchProps("FinishTime"),
//   },
//   {
//     title: "Giờ nghỉ",
//     dataIndex: "BreakAt",
//     key: "BreakAt",
//     render: (_, { BreakAt }) => {
//       if (BreakAt) {
//         return BreakAt;
//       }
//       return "";
//     },
//     width: 50,
//     sorter: (a, b) => compareDatetime(a, b, "BreakAt"),
//     ...getColumnSearchProps("BreakAt"),
//   },
//   {
//     title: "Kết thúc nghỉ",
//     dataIndex: "BreakEnd",
//     key: "BreakEnd",
//     render: (_, { BreakEnd }) => {
//       if (BreakEnd) {
//         return BreakEnd;
//       }
//       return "";
//     },
//     width: 50,
//     sorter: (a, b) => compareDatetime(a, b, "BreakEnd"),
//     ...getColumnSearchProps("BreakEnd"),
//   },
//   {
//     title: "Số giờ làm",
//     dataIndex: "Số giờ làm",
//     key: "Số giờ làm",
//     render: (_, record) => {
//       var time0 = dayjs(record.StartTime, Config.timeFormat);
//       var time1 = dayjs(record.FinishTime, Config.timeFormat);
//       var time2 = dayjs(record.BreakAt, Config.timeFormat);
//       var time3 = dayjs(record.BreakEnd, Config.timeFormat);
//       console.log(
//         time1.diff(time0, "minutes") - time3.diff(time2, "minutes")
//       );
//       var minutes =
//         time1.diff(time0, "minutes") - time3.diff(time2, "minutes");
//       var str = `${(minutes - (minutes % 60)) / 60} giờ`;
//       str += minutes % 60 == 0 ? "" : ` ${minutes % 60} phút`;
//       return str;
//     },
//     width: 50,
//   },
//   {
//     title: "Số giờ nghỉ",
//     dataIndex: "Số giờ nghỉ",
//     key: "Số giờ nghỉ",
//     render: (_, record) => {
//       var time2 = dayjs(record.BreakAt, Config.timeFormat);
//       var time3 = dayjs(record.BreakEnd, Config.timeFormat);
//       var minutes = time3.diff(time2, "minutes");
//       var str = `${(minutes - (minutes % 60)) / 60} giờ`;
//       str += minutes % 60 == 0 ? "" : ` ${minutes % 60} phút`;
//       return str;
//     },
//     width: 50,
//   },
//   {
//     title: "",
//     dataIndex: "actions",
//     key: "actions",
//     render: (_, shift) => (
//       <ActionMenu
//         shift={shift}
//         setShiftList={setCurrentShiftList}
//         shiftList={currentShiftList}
//         updateOneShift={updateOneShift}
//       />
//     ),
//     width: 50,
//   },
// ];
