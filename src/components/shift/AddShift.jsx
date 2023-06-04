import { PlusOutlined } from "@ant-design/icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Space,
  TimePicker,
  Tooltip,
  Typography,
  theme,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { CreateNewShift, GetShiftTypeList } from "./api";
import { handleErrorOfRequest } from "../../utils/Helpers";

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
          var shiftType = shiftTypeList.find((s) => s.Id == values.ShiftType);
          values.ShiftTypeText = shiftType.Description;
          notify.success({
            description: "Ca làm việc mới đã được tạo",
          });
          return;
        }
        notify.error({
          message: "Không thành công",
          description: Description,
        });
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
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
          labelAlign="left"
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
                message: "Vui lòng chọn ca làm việc",
              },
            ]}
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
          <Form.Item
            label="Ngày trong tuần"
            name="DayIndexList"
            required
            initialValue={[1, 2, 3, 4, 5]}
          >
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

const DayIndexEnum = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thurs: 4,
  Fri: 5,
  Sat: 6,
  Sun: 0,
};

const AddShiftPage = (props) => {
  const { insertOneShiftFE, notify } = props;
  const [form] = Form.useForm();
  const [startTime, setStartTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);
  const [startBreakTime, setStartBreakTime] = useState(null);
  const [endBreakTime, setEndBreakTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shiftTypeList, setShiftTypeList] = useState([]);
  const [totalWorkingTime, setTotalWorkingTime] = useState([0, 0]);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, colorBgLayout },
  } = theme.useToken();
  const [hasBreak, setHasBreak] = useState(false);

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

  useEffect(() => {
    calculateWorkingHour();
  }, []);

  const handleCancel = () => {
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
    CreateNewShift(values)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          values.Id = ResponseData.Id;
          var shiftType = shiftTypeList.find((s) => s.Id == values.ShiftType);
          values.ShiftTypeText = shiftType.Description;
          notify.success({
            description: "Ca làm việc mới đã được tạo",
          });
          handleCancel();
          navigate("/shift")
          return;
        }
        notify.error({
          message: "Không thành công",
          description: Description,
        });
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });

      })
      .finally(() => {
        setLoading(false);
      });
  };

  const calculateWorkingHour = () => {
    var startTime = form.getFieldValue("StartTime"),
      finishTime = form.getFieldValue("FinishTime"),
      breakAt = form.getFieldValue("BreakAt"),
      breakEnd = form.getFieldValue("BreakEnd"),
      hasBreak = form.getFieldValue("HasBreak");
    if (!finishTime || !startTime) {
      form.setFieldValue("WorkingHour", 0);
      return;
    }
    var diff1 = finishTime.diff(startTime, "hour", true);
    if (!hasBreak || !breakAt || !breakEnd) {
      form.setFieldValue("WorkingHour", diff1);
      return;
    }
    var diff2 = breakEnd.diff(breakAt, "hour", true);
    form.setFieldValue("WorkingHour", diff1 - diff2);
    return;
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Space align="baseline">
              <Tooltip title="Quay lại">
                <Button
                  onClick={() => navigate(-1)}
                  icon={<FontAwesomeIcon icon={faArrowLeft} size="2x" />}
                  type="text"
                  shape="circle"
                />
              </Tooltip>
              <Typography.Title level={2} style={{ marginTop: 0 }}>
                Thêm mới ca làm việc
              </Typography.Title>
            </Space>
            <Breadcrumb>
              <Breadcrumb.Item>
                <NavLink to="">Dashboard</NavLink>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <NavLink to="">Ca làm việc</NavLink>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={() => navigate("/shift/list")}>Hủy</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Lưu
            </Button>
          </Space>
        </Col>
      </Row>
      <Content style={{ background: colorBgContainer, padding: "5px 20px" }}>
        <Typography.Title
          level={4}
          style={{
            background: colorBgLayout,
            padding: "4px 8px",
            textTransform: "uppercase",
          }}
        >
          Thông tin chung
        </Typography.Title>

        <Form
          form={form}
          preserve={false}
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelWrap
          labelAlign="left"
          onFinish={onSubmit}
          initialValues={{
            StartTime: dayjs("08:00", Config.NonSecondFormat),
            FinishTime: dayjs("17:00", Config.NonSecondFormat),
          }}
        >
          <Form.Item
            form={form}
            hasFeedback
            label="Tên ca làm việc"
            name="Description"
            rules={[
              {
                required: true,
                message: "Mô tả là trường bắt buộc.",
              },
              {
                min: 8,
                message: "Tên ca làm việc cần tối thiểu 8 ký tự."
              }
              ,
              {
                max: 100,
                message:  "Tên ca làm việc cần tối đa 100 ký tự."
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Giờ bắt đầu ca"
            name="StartTime"
            rules={[
              {
                required: true,
                message: "Giờ bắt đầu ca là trường bắt buộc.",
              },
            ]}
          >
            <TimePicker
              minuteStep={15}
              locale={locale}
              format={Config.NonSecondFormat}
              style={{ display: "inline-block" }}
              onChange={() => calculateWorkingHour()}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Giờ kết thúc ca"
            name="FinishTime"
            rules={[
              {
                required: true,
                message: "Giờ kết thúc ca là trường bắt buộc.",
              },
            ]}
          >
            <TimePicker
              minuteStep={15}
              locale={locale}
              style={{ display: "inline-block" }}
              format={Config.NonSecondFormat}
              onChange={() => calculateWorkingHour()}
            />
          </Form.Item>
          <Form.Item name="HasBreak" valuePropName="checked">
            <Checkbox
              onChange={(e) => {
                setHasBreak(e.target.checked);
                calculateWorkingHour();
              }}
            >
              Có nghỉ giữa ca
            </Checkbox>
          </Form.Item>
          <Form.Item
            label="Giờ bắt đầu"
            hasFeedback
            name="BreakAt"
            required={hasBreak}
            hidden={!hasBreak}
          >
            <TimePicker
              onChange={() => calculateWorkingHour()}
              style={{ display: "inline-block" }}
              minuteStep={15}
              placeholder="Chọn giờ nghỉ"
              format={Config.NonSecondFormat}
              locale={locale}
            />
          </Form.Item>
          <Form.Item
            label="Giờ kết thúc"
            hasFeedback
            name="BreakEnd"
            required={hasBreak}
            hidden={!hasBreak}
          >
            <TimePicker
              onChange={() => calculateWorkingHour()}
              minuteStep={15}
              style={{ display: "inline-block" }}
              placeholder="Chọn giờ kết thúc nghỉ"
              format={Config.NonSecondFormat}
              locale={locale}
            />
          </Form.Item>
          <Typography.Title
            level={4}
            style={{
              background: colorBgLayout,
              padding: "4px 8px",
              textTransform: "uppercase",
            }}
          >
            TÍNH CÔNG
          </Typography.Title>
          <Form.Item>
            <Form.Item
              label="Giờ công"
              name="WorkingHour"
              style={{ display: "inline-block", width: "50%" }}
            >
              <InputNumber min={0} step={0.1} readOnly />
            </Form.Item>
            <Form.Item
              label="Ngày công"
              name="WorkingDay"
              style={{ display: "inline-block", width: "50%" }}
            >
              <InputNumber min={0} step={0.1} />
            </Form.Item>
          </Form.Item>
        </Form>
      </Content>
    </Space>
  );
};

export { AddShift, AddShiftPage };

