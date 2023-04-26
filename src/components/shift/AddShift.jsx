import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  TimePicker,
  Typography,
  notification,
  theme,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Config from "../../constant";
import { CreateNewShift, GetShiftTypeList } from "./api";

const AddShift = (props) => {
  const { insertOneShiftFE, notify, currentShiftList } = props;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);
  const [startBreakTime, setStartBreakTime] = useState(null);
  const [endBreakTime, setEndBreakTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shiftTypeList, setShiftTypeList] = useState([]);
  const [totalWorkingTime, setTotalWorkingTime] = useState([0, 0]);

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  useEffect(() => {
    async function loadData() {
      try {
        var response = await GetShiftTypeList();
        if (response.Status === 1) {
          setShiftTypeList(response.ResponseData);
          return;
        }
      } catch (error) {
      } finally {
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    var minutes = 0;
    if (startTime && finishTime) {
      var time0 = dayjs(startTime, Config.TimeFormat);
      var time1 = dayjs(finishTime, Config.TimeFormat);
      minutes = time1.diff(time0, "minutes") + 1;
      if (startBreakTime && endBreakTime) {
        var time2 = dayjs(startBreakTime, Config.TimeFormat);
        var time3 = dayjs(endBreakTime, Config.TimeFormat);
        minutes = minutes - (time3.diff(time2, "minutes") + 1);
      }
    }
    setTotalWorkingTime([(minutes - (minutes % 60)) / 60, minutes % 60]);
  }, [startTime, startBreakTime, endBreakTime, finishTime]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setEndBreakTime(null);
    setFinishTime(null);
    setStartBreakTime(null);
    setEndBreakTime(null);
  };
  const onSubmit = (values) => {
    setLoading(true);
    values.StartTime = dayjs(values.StartTime).format(Config.TimeFormat);
    values.FinishTime = dayjs(values.FinishTime).format(Config.TimeFormat);
    if (values.BreakAt) {
      values.BreakAt = dayjs(values.BreakAt).format(Config.TimeFormat);
    }
    if (values.BreakEnd) {
      values.BreakEnd = dayjs(values.BreakEnd).format(Config.TimeFormat);
    }
    var success = false;
    CreateNewShift(values)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          success = true;
          values.Id = ResponseData.Id;
          notification.success({
            description: "Ca làm việc mới đã được tạo",
          });
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
      })
      .finally(() => {
        setLoading(false);
        if (success) {
          insertOneShiftFE(values);
          handleCancel();
        }
      });
  };

  return (
    <Space>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Thêm ca làm việc
      </Button>
      <Modal
        title="Thêm ca làm việc"
        open={isModalOpen}
        keyboard={true}
        closable={true}
        footer={null}
        onCancel={handleCancel}
        destroyOnClose={true}
        width={600}
        okButtonProps={{ loading: loading }}
      >
        <Form
          preserve={false}
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelWrap
          labelAlign="right"
          onFinish={onSubmit}
        >
          <Form.Item
            form={form}
            hasFeedback
            label="Ca làm việc"
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
            <Input />
          </Form.Item>
          <Form.Item
            label="Loại ca làm việc"
            name="ShiftType"
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <Radio.Group
              optionType="button"
              defaultValue={shiftTypeList[0].Id}
              options={shiftTypeList.map((shiftType) => ({
                label: shiftType.Description,
                value: shiftType.Id,
              }))}
            />
          </Form.Item>
          <Typography.Title
            level={5}
            style={{ background: colorBgLayout, padding: "4px 8px" }}
          >
            Chi tiết
          </Typography.Title>
          <Form.Item
            hasFeedback
            label="Ngày bắt đầu"
            // wrapperCol={{ span: 6 }}
            name="StartDate"
            rules={[
              {
                required: true,
                message: "Ngày bắt đầu là trường bắt buộc.",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày bắt đầu"
              format={Config.DateFormat}
              locale={locale}
            />
          </Form.Item>
          <Form.Item hasFeedback label="Ngày kết thúc" name="EndDate">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày kết thúc"
              format={Config.DateFormat}
              locale={locale}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Giờ vào"
            // wrapperCol={{ span: 6 }}
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
              locale={locale}
              style={{ width: "100%" }}
              placeholder="Chọn giờ vào"
              format={Config.NonSecondFormat}
              onChange={(value) => setStartTime(value)}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
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
              locale={locale}
              onChange={(value) => setFinishTime(value)}
            />
          </Form.Item>
          <Form.Item label="Giờ nghỉ">
            <Form.Item
              hasFeedback
              name="BreakAt"
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
              <TimePicker
                minuteStep={15}
                style={{ width: "100%" }}
                placeholder="Chọn giờ nghỉ"
                format={Config.NonSecondFormat}
                locale={locale}
                onChange={(value) => setStartBreakTime(value)}
              />
            </Form.Item>
            <span
              style={{
                display: "inline-block",
                width: "24px",
                lineHeight: "32px",
                textAlign: "center",
              }}
            >
              -
            </span>
            <Form.Item
              hasFeedback
              name="BreakEnd"
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
              <TimePicker
                minuteStep={15}
                style={{ width: "100%" }}
                placeholder="Chọn giờ kết thúc nghỉ"
                format={Config.NonSecondFormat}
                locale={locale}
                onChange={(value) => setEndBreakTime(value)}
              />
            </Form.Item>
          </Form.Item>
          <Typography.Paragraph
            style={{ background: "#fff1b8", padding: "4px 8px" }}
          >
            {"Tổng thời gian làm việc: " +
              totalWorkingTime[0] +
              " giờ " +
              totalWorkingTime[1] +
              " phút"}
          </Typography.Paragraph>
          <div style={{ textAlign: "center" }}>
            <Space direction="horizontal" align="center">
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                size="middle"
                loading={loading}
              >
                Lưu
              </Button>
              <Button size="middle" onClick={handleCancel}>
                Quay lại
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </Space>
  );
};

export { AddShift };
