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
          notify.success({
            message: <b>Thông báo</b>,
            description: "Ca làm việc mới đã được tạo",
          });
          handleCancel();
          navigate("/shift");
          return;
        }
        throw new Error(Description || "Lỗi chưa xác định.");
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
    form.setFieldValue("WorkingHour", (diff1 - diff2).toFixed(2));
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
                message: "Tên ca làm việc cần tối thiểu 8 ký tự.",
              },
              {
                max: 100,
                message: "Tên ca làm việc cần tối đa 100 ký tự.",
              },
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

export { AddShiftPage };
