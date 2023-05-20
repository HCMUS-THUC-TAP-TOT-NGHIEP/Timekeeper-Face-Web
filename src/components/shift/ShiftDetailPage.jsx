import { EditOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Spin,
  TimePicker,
  Typography,
  theme
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Config from "../../constant";
import { GetShiftDetail, UpdateShift } from "./api";

const ShiftDetailPage = function ({ notify, ...rest }) {
  const { shiftId } = useParams();
  const [loading, setLoading] = useState(true);
  const [shift, setShift] = useState({});
  const [detail, setDetail] = useState({});
  const [hasBreak, setHasBreak] = useState(false);
  const [editable, setEditable] = useState((rest.editable || false));
  const [updatingLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, colorBgLayout },
  } = theme.useToken();
  const [form] = Form.useForm();

  useEffect(() => {
    loadingData();
  }, [shiftId]);

  useEffect(() => {
    form.setFieldsValue({
      Id: shift.Id,
      Description: shift.Description,
      StartTime: dayjs(detail.StartTime, Config.TimeFormat),
      FinishTime: dayjs(detail.FinishTime, Config.TimeFormat),
      HasBreak: detail.HasBreak,
      BreakAt: dayjs(detail.BreakAt, Config.TimeFormat),
      BreakEnd: dayjs(detail.BreakEnd, Config.TimeFormat),
      WorkingHour: detail.WorkingHour,
      WorkingDay: detail.WorkingDay,
    });
  }, [editable, shift, detail]);

  async function loadingData() {
    setLoading(true);
    try {
      var response = await GetShiftDetail({ Id: shiftId });
      var { Status, ResponseData, Description } = response;
      if (Status === 1) {
        var { Detail, Shift } = ResponseData;
        setDetail(Detail);
        setHasBreak(Detail.HasBreak);
        setShift(Shift);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

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

  const onUpdatingShift = async (values) => {
    try {
      setUpdateLoading(true);
      values.StartTime = values.StartTime.format("HH:mm:ss");
      values.FinishTime = values.FinishTime.format("HH:mm:ss");
      var { BreakEnd, BreakAt } = values;
      if (BreakEnd) values.BreakEnd = BreakEnd.format("HH:mm:ss");
      if (BreakAt) values.BreakAt = BreakAt.format("HH:mm:ss");
      console.log(values);
      var response = await UpdateShift(values);
      if (response.Status === 1) {
        setShift(response.ResponseData.Shift);
        setDetail(response.ResponseData.Detail);
        setEditable(false);
        notify.success({
          message: `Cập nhập ca làm việc ${shift.Id} thành công.`,
        });
        return;
      }
      notify.error({
        message: `Cập nhập ca làm việc ${shift.Id} không thành công.`,
        description: response.Description,
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
      setUpdateLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={3} style={{ marginTop: 0 }}>
              Ca làm việc
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <NavLink to="">Dashboard</NavLink>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <NavLink to="/shift">Ca làm việc</NavLink>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space>
            {editable ? (
              <>
                <Button onClick={() => navigate("/shift")}>Hủy</Button>
                <Button
                  type="primary"
                  loading={updatingLoading}
                  onClick={() => form.submit()}
                >
                  Lưu
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                onClick={() => setEditable(true)}
                icon={<EditOutlined />}
              >
                Sửa
              </Button>
            )}
          </Space>
        </Col>
      </Row>
      <Spin spinning={loading}>
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
          {editable ? (
            <Form
              form={form}
              preserve={false}
              autoComplete="off"
              labelCol={{ span: 4 }}
              labelWrap
              labelAlign="left"
              onFinish={onUpdatingShift}
              initialValues={{
                Id: shift.Id,
                Description: shift.Description,
                StartTime: dayjs(detail.StartTime, Config.TimeFormat),
                FinishTime: dayjs(detail.FinishTime, Config.TimeFormat),
                HasBreak: detail.HasBreak,
                BreakAt: dayjs(detail.BreakAt, Config.TimeFormat),
                BreakEnd: dayjs(detail.BreakEnd, Config.TimeFormat),
                WorkingHour: detail.WorkingHour,
                WorkingDay: detail.WorkingDay,
              }}
            >
              <Form.Item
                hasFeedback
                label="Tên ca làm việc"
                name="Description"
                wrapperCol={{ span: 20 }}
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
                label="Mã ca làm việc"
                name="Id"
                wrapperCol={{ span: 4 }}
                required
              >
                <Input readOnly />
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
                wrapperCol={{ span: 4 }}
              >
                <TimePicker
                  minuteStep={15}
                  locale={locale}
                  format={Config.NonSecondFormat}
                  style={{ width: "100%" }}
                  onChange={() => calculateWorkingHour()}
                />
              </Form.Item>
              <Form.Item
                hasFeedback={editable}
                label="Giờ kết thúc ca"
                name="FinishTime"
                wrapperCol={{ span: 4 }}
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
                  style={{ width: "100%" }}
                  format={Config.NonSecondFormat}
                  onChange={() => calculateWorkingHour()}
                />
              </Form.Item>
              <Form.Item name="HasBreak" valuePropName="checked">
                <Checkbox
                  disabled={!editable}
                  checked={hasBreak}
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
                wrapperCol={{ span: 4 }}
              >
                <TimePicker
                  onChange={() => calculateWorkingHour()}
                  style={{ width: "100%" }}
                  minuteStep={15}
                  placeholder="Chọn giờ nghỉ"
                  format={Config.NonSecondFormat}
                  locale={locale}
                />
              </Form.Item>
              <Form.Item
                label="Giờ kết thúc"
                hasFeedback={editable}
                name="BreakEnd"
                required={hasBreak}
                hidden={!hasBreak}
                wrapperCol={{ span: 4 }}
              >
                <TimePicker
                  onChange={() => calculateWorkingHour()}
                  minuteStep={15}
                  placeholder="Chọn giờ kết thúc nghỉ"
                  format={Config.NonSecondFormat}
                  locale={locale}
                  style={{ width: "100%" }}
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
                  <InputNumber
                    min={0}
                    step={0.1}
                    readOnly
                    style={{ borderBottom: "solid 1px #ccc" }}
                  />
                </Form.Item>
                <Form.Item
                  label="Ngày công"
                  name="WorkingDay"
                  style={{ display: "inline-block", width: "50%" }}
                >
                  <InputNumber
                    min={0}
                    step={0.1}
                    style={{ borderBottom: "solid 1px #ccc" }}
                  />
                </Form.Item>
              </Form.Item>
            </Form>
          ) : shift && detail ? (
            <OnlyViewDetailComponent shift={shift} detail={detail} />
          ) : (
            <></>
          )}
        </Content>
      </Spin>
    </Space>
  );
};

const OnlyViewDetailComponent = ({ shift, detail, ...rest }) => {
  const {
    token: { colorBgContainer, colorBgLayout },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [hasBreak, setHasBreak] = useState(false);
  useEffect(() => {
    form.setFieldsValue({
      Id: shift.Id,
      Description: shift.Description,
      StartTime: dayjs(detail.StartTime, Config.TimeFormat).format(
        Config.NonSecondFormat
      ),
      FinishTime: dayjs(detail.FinishTime, Config.TimeFormat).format(
        Config.NonSecondFormat
      ),
      HasBreak: detail.HasBreak,
      BreakAt: detail.HasBreak
        ? dayjs(detail.BreakAt, Config.TimeFormat).format(
            Config.NonSecondFormat
          )
        : null,
      BreakEnd: detail.HasBreak
        ? dayjs(detail.BreakEnd, Config.TimeFormat).format(
            Config.NonSecondFormat
          )
        : null,
      WorkingHour: detail.WorkingHour,
      WorkingDay: detail.WorkingDay,
    });
    setHasBreak(detail.HasBreak);
  }, [shift, detail]);

  return (
    <Form
      preserve={false}
      form={form}
      autoComplete="off"
      labelCol={{ span: 4 }}
      labelWrap
      labelAlign="left"
    >
      <Form.Item
        label="Tên ca làm việc"
        name="Description"
        wrapperCol={{ span: 20 }}
        required
      >
        <Input
          readOnly
          bordered={false}
          style={{ borderBottom: "solid 1px #ccc" }}
        />
      </Form.Item>
      <Form.Item
        label="Mã ca làm việc"
        name="Id"
        wrapperCol={{ span: 4 }}
        required
      >
        <Input
          readOnly
          bordered={false}
          style={{
            borderBottom: "solid 1px #ccc",
            display: "inline-block",
          }}
        />
      </Form.Item>
      <Form.Item
        label="Giờ bắt đầu ca"
        name="StartTime"
        wrapperCol={{ span: 4 }}
        required
      >
        <Input
          readOnly
          bordered={false}
          style={{
            borderBottom: "solid 1px #ccc",
            display: "inline-block",
          }}
        />
      </Form.Item>
      <Form.Item
        label="Giờ kết thúc ca"
        name="FinishTime"
        wrapperCol={{ span: 4 }}
        required
      >
        <Input
          readOnly
          bordered={false}
          style={{
            borderBottom: "solid 1px #ccc",
            display: "inline-block",
          }}
        />
      </Form.Item>
      <Form.Item name="HasBreak" valuePropName="checked">
        <Checkbox disabled checked={hasBreak}>
          Có nghỉ giữa ca
        </Checkbox>
      </Form.Item>
      <Form.Item
        label="Giờ bắt đầu"
        name="BreakAt"
        required
        hidden={!hasBreak}
        wrapperCol={{ span: 4 }}
      >
        <Input
          readOnly
          bordered={false}
          style={{
            borderBottom: "solid 1px #ccc",
            display: "inline-block",
          }}
        />
      </Form.Item>
      <Form.Item
        label="Giờ kết thúc"
        name="BreakEnd"
        required
        hidden={!hasBreak}
        wrapperCol={{ span: 4 }}
      >
        <Input
          readOnly
          bordered={false}
          style={{
            borderBottom: "solid 1px #ccc",
            display: "inline-block",
          }}
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
          <InputNumber
            readOnly
            bordered={false}
            style={{ borderBottom: "solid 1px #ccc" }}
          />
        </Form.Item>
        <Form.Item
          label="Ngày công"
          name="WorkingDay"
          style={{ display: "inline-block", width: "50%" }}
        >
          <InputNumber
            readOnly
            bordered={false}
            style={{ borderBottom: "solid 1px #ccc" }}
          />
        </Form.Item>
      </Form.Item>
    </Form>
  );
};

export { ShiftDetailPage };

