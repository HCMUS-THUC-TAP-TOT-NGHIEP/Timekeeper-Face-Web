import {
  CloseOutlined,
  DeleteFilled,
  EditFilled,
  EditTwoTone,
  InfoCircleTwoTone
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col, Form,
  Input, Modal,
  notification,
  Popconfirm,
  Row, Skeleton,
  Space,
  Table,
  TimePicker,
  Tooltip
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreateNewShift,
  DeleteShift,
  GetShiftList, UpdateShift
} from "./api";

const ShiftList = function(props) {
  const [loading, setLoading] = useState(true);
  const [currentShiftList, setCurrentShiftList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [form] = Form.useForm();
  const [notify, contextHolder] = notification.useNotification();

  useEffect(() => {
    document.title = "Danh mục ca làm việc";
  }, []);
  useEffect(() => {
    GetShiftList()
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          setCurrentShiftList(ResponseData);
          return;
        }
      })
      .catch((error) => {
        if (error.response) {
          notify.error({
            message: "Có lỗi",
            description: `[${error.response.statusText}]`,
          });
        } else if (error.request) {
          notify.error({
            message: "Có lỗi.",
            description: error,
          });
        } else {
          notify.error({
            message: "Có lỗi.",
            description: error.message,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [perPage, page]);

  const columns = [
    {
      title: "Mã",
      dataIndex: "Id",
      key: "Id",
      sorter: (a, b) => a.Id - b.Id,
      fixed: "left",
    },
    {
      title: "Mô tả",
      dataIndex: "Description",
      key: "Description",
      sorter: (a, b) => a.Description.localeCompare(b.Description),
    },
    {
      title: "Giờ vào",
      dataIndex: "StartTime",
      key: "StartTime",
      render: (_, { StartTime }) => {
        if (StartTime) {
          return StartTime;
        }
        return "";
      },
    },
    {
      title: "Giờ ra",
      dataIndex: "FinishTime",
      key: "FinishTime",
      render: (_, { FinishTime }) => {
        if (FinishTime) {
          return FinishTime;
        }
        return "";
      },
    },
    {
      title: "Giờ nghỉ",
      dataIndex: "BreakAt",
      key: "BreakAt",
      render: (_, { BreakAt }) => {
        if (BreakAt) {
          return BreakAt;
        }
        return "";
      },
    },
    {
      title: "Kết thúc nghỉ",
      dataIndex: "BreakEnd",
      key: "BreakEnd",
      render: (_, { BreakEnd }) => {
        if (BreakEnd) {
          return BreakEnd;
        }
        return "";
      },
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_, shift) => (
        <ActionMenu
          shift={shift}
          setShiftList={setCurrentShiftList}
          shiftList={currentShiftList}
          updateOneShift={updateOneShift}
        />
      ),
    },
  ];
  const insertOneShift = (values) => {
    setCurrentShiftList([...currentShiftList, values]);
  };

  const updateOneShift = (values) => {
    const newCurrentShiftList = currentShiftList.map((shift) => {
      if (shift.Id === values.Id) {
        return values;
      } else {
        return shift;
      }
    });
    setCurrentShiftList(newCurrentShiftList);
  };

  const showCreateForm = () => {
    Modal.confirm({
      title: "Tạo ca làm việc",
      icon: <InfoCircleTwoTone />,
      content: (
        <AddShiftForm
          form={form}
          listState={[insertOneShift, currentShiftList]}
        />
      ),
      cancelText: "Hủy",
      okText: "Tạo mới",
      onOk() {
        form.submit();
      },
      width: 600,
    });
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/shift-list">Danh mục ca làm việc</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button type="primary" onClick={showCreateForm}>
            Tạo ca làm việc mới
          </Button>
        </Col>
      </Row>
      <Skeleton loading={loading} active={loading}>
        <Table
          bordered
          scroll={{
            x: 900,
          }}
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={currentShiftList}
          columns={columns}
        />
      </Skeleton>
    </Space>
  );
};

const AddShiftForm = (props) => {
  const form = props.form;
  const [insertOneShift, currentShiftList] = props.listState;
  const onSubmit = (values) => {
    const patternTime = "HH:mm:ss";
    values.StartTime = dayjs(values.StartTime).format(patternTime);
    values.FinishTime = dayjs(values.FinishTime).format(patternTime);
    if (values.BreakAt) {
      values.BreakAt = dayjs(values.BreakAt).format(patternTime);
    }
    if (values.BreakEnd) {
      values.BreakEnd = dayjs(values.BreakEnd).format(patternTime);
    }
    CreateNewShift(values)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          notification.success({
            description: "Ca làm việc mới đã được tạo",
          });
          values.Id = ResponseData.Id;
          insertOneShift(values);
          return;
        }
        notification.error({
          message: "Không thành công",
          description: Description,
        });
      })
      .catch((error) => {
        if (error.response) {
          notification.error({
            message: "Có lỗi",
            description: `[${error.response.statusText}]`,
          });
        } else if (error.request) {
          notification.error({
            message: "Có lỗi.",
            description: error,
          });
        } else {
          notification.error({
            message: "Có lỗi.",
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
    >
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
            label="Tên hoặc mô tả"
            name="Description"
            rules={[
              {
                required: true,
                message: "Mô tả là trường bắt buộc.",
              },
              {
                validator: (_, value) => {
                  var exist = currentShiftList.find(
                    (shift) => shift.Description == value
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
              format="HH:mm:ss"
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
              format="HH:mm:ss"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            hasFeedback
            labelCol={24}
            label="Giờ nghỉ"
            name="BreakAt"
            // rules={[]}
          >
            <TimePicker
              minuteStep={15}
              style={{ width: "100%" }}
              placeholder="Chọn giờ nghỉ"
              format="HH:mm:ss"
              // value={dayjs("hh:mm:ss ")}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            hasFeedback
            labelCol={24}
            label="Giờ kết thúc nghỉ"
            name="BreakEnd"
            // rules={[]}
          >
            <TimePicker
              minuteStep={15}
              style={{ width: "100%" }}
              placeholder="Chọn giờ kết thúc nghỉ"
              format="HH:mm:ss"
            />
          </Form.Item>
        </Col>
        {/* <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            hasFeedback
            labelCol={24}
            label="Trạng thái"
            name="Status"
            rules={[
              {
                required: true,
                message: "Trạng thái là trường bắt buộc.",
              },
            ]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option key="1" value={1}>
                Hoạt động
              </Select.Option>
              <Select.Option key="2" value={0}>
                Không hoạt động
              </Select.Option>
            </Select>
          </Form.Item>
        </Col> */}
      </Row>
    </Form>
  );
};

function ActionMenu(props) {
  const [form] = Form.useForm();
  const { shift, setShiftList, shiftList, updateOneShift } = props;
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
          message: "Thất bại",
          description: Description,
        });
      })
      .catch((error) => {
        if (error.response) {
          notification.error({
            message: "Có lỗi",
            description: `[${error.response.statusText}]`,
          });
        } else if (error.request) {
          notification.error({
            message: "Có lỗi.",
            description: error,
          });
        } else {
          notification.error({
            message: "Có lỗi.",
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
      <Space size="middle"
        onClick={showEditForm}
        style={{ padding: 4, margin: 1, cursor: "pointer" }}
      >
        <Tooltip title="Chỉnh sửa">
          <EditFilled />
        </Tooltip>
      </Space>
      <Popconfirm
        title={`Xóa ca làm việc ID ${shift.Id}`}
        description={`Bạn có chắc muốn xóa ID ${shift.Id} - ${shift.Description}?`}
        okText="Yes"
        okType="danger"
        cancelText="No"
        placement="top"
        onConfirm={deleteShift}
        icon={<DeleteFilled />}
      >
        <Tooltip title="Xóa">
          <DeleteFilled
            key="1"
            style={{ padding: 4, margin: 1, cursor: "pointer" }}
          />
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
  }, [shift]);
  const onSubmit = (values) => {
    console.log(values);
    values.StartTime = dayjs(values.StartTime).format(timePattern);
    values.FinishTime = dayjs(values.FinishTime).format(timePattern);
    if (values.BreakAt) {
      values.BreakAt = dayjs(values.BreakAt).format(timePattern);
    }
    if (values.BreakEnd) {
      values.BreakEnd = dayjs(values.BreakEnd).format(timePattern);
    }
    console.log(values);
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
          notification.error({
            message: "Request có lỗi.",
            description: `Data: [${error.response.data}], Status [${error.response.status}]`,
          });
        } else if (error.request) {
          notification.error({
            message: "Response có lỗi.",
            description: error.response,
          });
        } else {
          notification.error({
            message: "Có lỗi xảy ra",
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
              format="HH:mm:ss"
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
              format="HH:mm:ss"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item hasFeedback labelCol={24} label="Giờ nghỉ" name="BreakAt">
            <TimePicker
              minuteStep={15}
              style={{ width: "100%" }}
              placeholder="Chọn giờ nghỉ"
              format="HH:mm:ss"
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
              format="HH:mm:ss"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export { ShiftList };

