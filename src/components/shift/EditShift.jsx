import { EditTwoTone } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Space,
  TimePicker,
  Tooltip,
  Typography,
  notification,
  theme,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { default as React, useEffect, useState } from "react";
import Config from "../../constant";
import { GetShiftTypeList, UpdateShift } from "./api";
import { useNavigate } from "react-router-dom";
import { handleErrorOfRequest } from "../../utils/Helpers";

const EditShift = (props) => {
  const { notify, updateOneShift, shiftList, shift } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shiftTypeList, setShiftTypeList] = useState([]);
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const [startTime, setStartTime] = useState(shift.StartTime);
  const [finishTime, setFinishTime] = useState(shift.FinishTime);
  const [startBreakTime, setStartBreakTime] = useState(shift.BreakAt);
  const [endBreakTime, setEndBreakTime] = useState(shift.BreakEnd);
  const [totalWorkingTime, setTotalWorkingTime] = useState([0, 0]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        var response = await GetShiftTypeList();
        if (response.Status === 1) {
          setShiftTypeList(response.ResponseData);
          return;
        }
      } catch (error) {
        handleErrorOfRequest({ notify, error });
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
  }, [startTime, startBreakTime, endBreakTime, finishTime, isModalOpen]);

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
    values.StartDate = dayjs(values.StartDate).format("YYYY-MM-DD");
    values.FinishDate = dayjs(values.FinishDate).format("YYYY-MM-DD");
    values.StartTime = dayjs(values.StartTime).format(Config.TimeFormat);
    values.FinishTime = dayjs(values.FinishTime).format(Config.TimeFormat);
    if (values.BreakAt) {
      values.BreakAt = dayjs(values.BreakAt).format(Config.TimeFormat);
    }
    if (values.BreakEnd) {
      values.BreakEnd = dayjs(values.BreakEnd).format(Config.TimeFormat);
    }
    values.Id = shift.Id;
    var shiftType = shiftTypeList.find((s) => s.Id == values.ShiftType);
    values.ShiftTypeText = shiftType.Description;
    var success = false;
    UpdateShift(values)
      .then((response) => {
        const { Status, Description } = response;
        if (Status === 1) {
          notification.success({
            description: "Chỉnh sửa thành công",
          });
          success = true;
          return;
        }
        notification.error({
          message: "Có lỗi",
          description: Description,
        });
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      })
      .finally(() => {
        setLoading(false);
        if (success) {
          updateOneShift(values);
          setIsModalOpen(false);
        }
      });
  };
  return (
    <Space>
      <Tooltip title="Chỉnh sửa">
        <Button
          type="text"
          shape="circle"
          icon={<EditTwoTone />}
          size="small"
          onClick={() => navigate(`/shift/edit/${shift.Id}`)}
        />
      </Tooltip>
      <Modal
        title="Chỉnh sửa"
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
          labelAlign="left"
          onFinish={onSubmit}
          initialValues={{
            Id: shift.Id,
            Description: shift.Description,
            StartDate: dayjs(shift.StartDate).locale("vi"),
            EndDate: dayjs(shift.EndDate).locale("vi"),
            StartTime: dayjs(shift.StartTime, Config.NonSecondFormat).locale(
              "vi"
            ),
            FinishTime: dayjs(shift.FinishTime, Config.NonSecondFormat).locale(
              "vi"
            ),
            BreakAt: shift.BreakAt
              ? dayjs(shift.BreakAt, Config.NonSecondFormat)
              : undefined,
            BreakEnd: shift.BreakEnd
              ? dayjs(shift.BreakEnd, Config.NonSecondFormat)
              : undefined,
            ShiftType: shift.ShiftType,
            DayIndexList: shift.DayIndexList,
            Note: shift.Note,
            Status: shift.Status,
          }}
        >
          <Form.Item name="Status" hidden>
            <Input readOnly />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Ca làm việc"
            name="Description"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên hoặc mô tả ca làm việc.",
              },
              {
                validator: (_, value) => {
                  var exist = shiftList.find(
                    (s) => s.Description == value && s.Id !== shift.Id
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
            hasFeedback
          >
            <Radio.Group
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
            label="Ngày bắt đầu"
            // wrapperCol={{ span: 6 }}
            name="StartDate"
            rules={[
              {
                required: true,
                message: "Ngày bắt đầu là trường bắt buộc.",
              },
            ]}
            hasFeedback
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
            label="Giờ vào"
            // wrapperCol={{ span: 6 }}
            name="StartTime"
            rules={[
              {
                required: true,
                message: "Giờ vào là trường bắt buộc.",
              },
            ]}
            hasFeedback
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
            label="Giờ ra"
            name="FinishTime"
            rules={[
              {
                required: true,
                message: "Giờ ra là trường bắt buộc.",
              },
            ]}
            hasFeedback
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
              name="BreakAt"
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
              hasFeedback
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
              name="BreakEnd"
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
              hasFeedback
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
          <Form.Item label="Ngày trong tuần" name="DayIndexList" required>
            <Checkbox.Group>
              <Row>
                <Col span={8}>
                  <Checkbox value={1}>Thứ 2</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={2}>Thứ 3</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={3}>Thứ 4</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={4}>Thứ 5</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={5}>Thứ 6</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={6} checked>
                    Thứ 7
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={0}>Chủ nhật</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="Ghi chú" name="Note">
            <Input.TextArea
              // autoSize={{ minRows: 2 }}
              maxLength={2000}
              showCount
              allowClear
            ></Input.TextArea>
          </Form.Item>
          <div style={{ textAlign: "center" }}>
            <Space direction="horizontal" align="center">
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                size="middle"
                loading={loading}
              >
                Lưu thay đổi
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
export { EditShift };
