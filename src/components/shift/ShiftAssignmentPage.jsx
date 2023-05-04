import {
  EditOutlined,
  PlusOutlined,
  RollbackOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  TimePicker,
  Typography,
  theme,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import TextArea from "antd/es/input/TextArea";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Config from "../../constant";
import { GetDepartmentList } from "../department/api";
import { GetManyEmployee } from "../employee/api";
import {
  AssignShift,
  GetAssignmentDetail,
  GetAssignmentType,
  GetShiftList,
  UpdateShiftAssignment,
  _TargeType,
} from "./api";

const ShiftAssignmentPage = (props) => {
  const { notify } = props;
  const navigate = useNavigate();
  const [assignmentTypeList, setAssignmentTypeList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [shiftDetail, setShiftDetail] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [assignmentType, setAssignmentType] = useState(-1);
  const [loading, setLoading] = useState(true);

  const assignShift = (values) => {
    console.log(values);
    if (values.StartDate) {
      values.StartDate = dayjs(values.StartDate).format(Config.DateFormat);
    }
    if (values.EndDate) {
      values.EndDate = dayjs(values.EndDate).format(Config.DateFormat);
    }
    console.log(values);
    AssignShift(values)
      .then((response) => {
        console.log(response);
        const { Status, ResponseData, Description } = response;
        if (Status === 1) {
          notify.success({
            description: "Tạo mới phân ca thành công.",
          });
          navigate("/shift/assignment/detail/" + ResponseData.Id);
          return;
        }
        notify.error({
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
  useEffect(() => {
    async function loadData() {
      try {
        const response1 = await GetAssignmentType();
        if (response1.Status !== 1) {
          notify.error({
            message: "Không thành công",
            description: response1.Description,
          });
          return;
        }
        const response2 = await GetShiftList();
        if (response2.Status !== 1) {
          notify.error({
            message: "Không thành công",
            description: response2.Description,
          });
          return;
        }
        const response3 = await GetDepartmentList();
        if (response3.Status !== 1) {
          notify.error({
            message: "Không thành công",
            description: response3.Description,
          });
          return;
        }
        const response5 = await GetManyEmployee();
        if (response5.Status !== 1) {
          notify.error({
            message: "Không thành công",
            description: response5.Description,
          });
          return;
        }
        setShiftList(response2.ResponseData);
        setAssignmentTypeList(response1.ResponseData);
        setEmployeeList(response5.ResponseData);
        setDepartmentList(response3.ResponseData);
        return;
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
    }
    loadData();
  }, [notify]);
  const changeAssignType = ({ value }) => {
    setAssignmentType(value);
  };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Phân ca làm việc
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/shift">Quản lý ca làm việc</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="">Phân ca</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button type="primary" icon={<PlusOutlined />}>
            Tạo phân ca mới
          </Button>
        </Col>
      </Row>
      <Content style={{ padding: 20 }}>
        <Spin spinning={loading}>
          <Form
            layout="horizontal"
            labelCol={{ sm: { span: 6 }, md: { span: 4 } }}
            wrapperCol={{ sm: { span: 18 }, md: { span: 20 } }}
            labelWrap
            onFinish={assignShift}
            labelAlign="left"
          >
            <Form.Item
              label="Tiêu đề"
              name="Description"
              required
              rules={[
                {
                  required: true,
                  message: "Tiêu đề là trường bắt buộc.",
                },
              ]}
            >
              <Input placeholder="Nhập tiêu đề" />
            </Form.Item>
            <Form.Item
              label="Kiểu phân ca"
              name="AssignType"
              required
              rules={[
                {
                  required: true,
                  message: "Kiểu phân ca là trường bắt buộc.",
                },
              ]}
            >
              {/* <Select
                    showSearch
                    placeholder="Chọn kiểu phân ca"
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      if (!option) return false;
                      return (option.label || "")
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }}
                    options={assignmentTypeList.map((ob) => ({
                      value: ob.Id,
                      label: ob.Name,
                    }))}
                    onChange={changeAssignType}
                  /> */}

              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                onChange={(e) => changeAssignType(e.target)}
                options={assignmentTypeList.map((assignmentType) => ({
                  label: assignmentType.Name,
                  value: assignmentType.Id,
                }))}
              />
            </Form.Item>
            <Form.Item
              label="Ca"
              name="ShiftId"
              required
              rules={[
                {
                  required: true,
                  message: "Ca là trường bắt buộc.",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn Ca"
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (!option) return false;
                  return (option.label || "")
                    .toLowerCase()
                    .includes(input.toLowerCase());
                }}
                onChange={(value, option) => {
                  var shift = shiftList.find((s) => s.Id == value);
                  setShiftDetail(shift);
                }}
                options={shiftList.map((ob) => ({
                  value: ob.Id,
                  label: ob.Description,
                }))}
              />
            </Form.Item>
            {assignmentType == _TargeType.ByDepartment ? (
              <Form.Item label="Phòng ban" name="DepartmentId" required>
                <Select
                  showSearch
                  placeholder="Chọn phòng ban"
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    if (!option) return false;
                    return (option.label || "")
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  mode="multiple"
                  options={departmentList.map((ob) => ({
                    value: ob.Id,
                    label: ob.Name,
                  }))}
                />
              </Form.Item>
            ) : assignmentType == _TargeType.ByEmployee ? (
              <Form.Item label="Chọn nhân viên" name="EmployeeId" required>
                <Select
                  showSearch
                  placeholder="Chọn nhân viên"
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    if (!option) return false;
                    return (option.label || "")
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  mode="multiple"
                  options={employeeList.map((ob) => ({
                    value: ob.Id,
                    label: `${ob.Id} - ${ob.FirstName} ${ob.LastName}`,
                  }))}
                />
              </Form.Item>
            ) : (
              <></>
            )}
            {shiftDetail ? (
              <>
                <Form.Item label="Từ ngày" required>
                  <DatePicker
                    value={
                      shiftDetail.StartDate
                        ? dayjs(shiftDetail.StartDate)
                        : null
                    }
                    format={Config.DateFormat}
                    locale={locale}
                    // style={{ width: "100%" }}
                    inputReadOnly={true}
                    aria-readonly={true}
                    style={{ display: "inline-block", width: "calc(40%)" }}
                  />
                  <span
                    style={{
                      display: "inline-block",
                      lineHeight: "32px",
                      textAlign: "center",
                      marginRight: "12px",
                      marginLeft: "12px",
                    }}
                  >
                    đến
                  </span>
                  <DatePicker
                    value={
                      shiftDetail.EndDate ? dayjs(shiftDetail.EndDate) : null
                    }
                    format={Config.DateFormat}
                    locale={locale}
                    inputReadOnly={true}
                    aria-readonly={true}
                    style={{ display: "inline-block", width: "calc(40%)" }}
                  />
                </Form.Item>
                <Form.Item label="Giờ làm việc" required>
                  <TimePicker
                    value={
                      shiftDetail.StartTime
                        ? dayjs(shiftDetail.StartTime, Config.TimeFormat)
                        : null
                    }
                    format={Config.NonSecondFormat}
                    locale={locale}
                    style={{ display: "inline-block", width: "calc(40%)" }}
                    inputReadOnly={true}
                    aria-readonly={true}
                  />
                  <span
                    style={{
                      display: "inline-block",
                      lineHeight: "32px",
                      textAlign: "center",
                      marginRight: "12px",
                      marginLeft: "12px",
                    }}
                  >
                    đến
                  </span>
                  <TimePicker
                    value={
                      shiftDetail.FinishTime
                        ? dayjs(shiftDetail.FinishTime, Config.TimeFormat)
                        : null
                    }
                    format={Config.NonSecondFormat}
                    locale={locale}
                    inputReadOnly={true}
                    aria-readonly={true}
                    style={{ display: "inline-block", width: "calc(40%)" }}
                  />
                </Form.Item>
                <Form.Item label="Giờ nghỉ">
                  <TimePicker
                    value={
                      shiftDetail.BreakAt
                        ? dayjs(shiftDetail.BreakAt, Config.TimeFormat)
                        : null
                    }
                    format={Config.NonSecondFormat}
                    locale={locale}
                    style={{ display: "inline-block", width: "calc(40%)" }}
                    inputReadOnly={true}
                    aria-readonly={true}
                  />
                  <span
                    style={{
                      display: "inline-block",
                      lineHeight: "32px",
                      textAlign: "center",
                      marginRight: "12px",
                      marginLeft: "12px",
                    }}
                  >
                    đến
                  </span>
                  <TimePicker
                    value={
                      shiftDetail.BreakEnd
                        ? dayjs(shiftDetail.BreakEnd, Config.TimeFormat)
                        : null
                    }
                    format={Config.NonSecondFormat}
                    locale={locale}
                    inputReadOnly={true}
                    aria-readonly={true}
                    style={{ display: "inline-block", width: "calc(40%)" }}
                  />
                </Form.Item>
                <Form.Item label="Thời gian nghỉ">
                  <InputNumber
                    value={shiftDetail.BreakMinutes}
                    addonAfter="phút"
                    readOnly
                  />
                </Form.Item>
                <Form.Item label="Ngày trong tuần" required>
                  <Checkbox.Group
                    value={
                      shiftDetail.DayIndexList ? shiftDetail.DayIndexList : []
                    }
                  >
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
              </>
            ) : (
              <></>
            )}

            <Form.Item label="Ghi chú" name="Note">
              <TextArea
                showCount
                maxLength={1000}
                style={{
                  height: 120,
                  marginBottom: 24,
                }}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<SaveOutlined />}
                >
                  Lưu
                </Button>
                <Button
                  type="default"
                  size="large"
                  icon={<RollbackOutlined />}
                  onClick={() => navigate("/shift")}
                >
                  Trở lại danh sách ca
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Content>
    </Space>
  );
};

const EditShiftAssignmentPage = (props) => {
  const { id } = useParams();
  const { notify } = props;
  const navigate = useNavigate();
  const [assignmentTypeList, setAssignmentTypeList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState({});
  const [assignmentDetail, setAssignmentDetail] = useState({});
  const [shiftDetail, setShiftDetail] = useState({});

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const assignShift = (values) => {
    UpdateShiftAssignment(values)
      .then((response) => {
        const { Status, Description } = response;
        if (Status === 1) {
          notify.success({
            description: "Cập nhật phân ca thành công.",
          });
          navigate("/shift/assignment/detail/" + id);
          return;
        }
        notify.error({
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
  useEffect(() => {
    async function loadData() {
      try {
        const response = await GetAssignmentDetail({ Id: id });
        if (response.Status != 1) {
          return;
        }
        const response1 = await GetAssignmentType();
        if (response.Status != 1) {
          return;
        }
        const response2 = await GetShiftList();
        if (response.Status != 1) {
        }
        const response3 = await GetDepartmentList();
        if (response.Status != 1) {
          return;
        }
        const response5 = await GetManyEmployee();
        if (response.Status != 1) {
          return;
        }
        setAssignmentTypeList(response1.ResponseData);
        setShiftList(response2.ResponseData);
        setDepartmentList(response3.ResponseData);
        setEmployeeList(response5.ResponseData);
        const { Assignment, AssignmentDetail, ShiftDetail } =
          response.ResponseData;
        setAssignment(Assignment);
        setAssignmentDetail(AssignmentDetail);
        setShiftDetail(ShiftDetail);
        return;
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
    }
    loadData();
  }, [id]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Phân ca làm việc
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/shift">Quản lý ca làm việc</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="">Phân ca</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => navigate("/shift/assignment")}
            icon={<PlusOutlined />}
          >
            Phân ca mới
          </Button>
        </Col>
      </Row>
      <Content style={{ background: colorBgContainer, padding: 20 }}>
        <Spin spinning={loading}>
          <Skeleton loading={loading}>
            <Form
              layout="horizontal"
              labelCol={{ sm: { span: 6 }, md: { span: 4 } }}
              wrapperCol={{ sm: { span: 18 }, md: { span: 20 } }}
              labelAlign="left"
              onFinish={assignShift}
              labelWrap
            >
              <Form.Item
                label="Mã"
                name="Id"
                initialValue={assignment.Id}
                required
                hidden
              >
                <Input readOnly placeholder="Nhập tiêu đề" />
              </Form.Item>
              <Form.Item
                label="Tiêu đề"
                name="Description"
                initialValue={assignment.Description}
                required
                rules={[
                  {
                    required: true,
                    message: "Tiêu đề là trường bắt buộc.",
                  },
                ]}
              >
                <Input placeholder="Nhập tiêu đề" />
              </Form.Item>
              <Form.Item
                label="Kiểu phân ca"
                name="AssignType"
                required
                rules={[
                  {
                    required: true,
                    message: "Kiểu phân ca là trường bắt buộc.",
                  },
                ]}      
                initialValue={assignment.AssignType}          
              >
                <Radio.Group
                  optionType="button"
                  buttonStyle="solid"
                  options={assignmentTypeList.map((ob) => ({
                    value: ob.Id,
                    label: ob.Name,
                  }))}
                  value={assignment.AssignType}
                />
              </Form.Item>
              <Form.Item
                label="Ca"
                name="ShiftId"
                required
                rules={[
                  {
                    required: true,
                    message: "Ca là trường bắt buộc.",
                  },
                ]}
                initialValue={shiftDetail.ShiftId}
              >
                <Select
                  showSearch
                  placeholder="Chọn Ca"
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    if (!option) return false;
                    return (option.label || "")
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  options={shiftList.map((ob) => ({
                    value: ob.Id,
                    label: ob.Description,
                  }))}
                  value={assignment.ShiftId}
                  disabled
                />
              </Form.Item>
              {assignment.AssignType == _TargeType.ByDepartment ? (
                <Form.Item
                  label="Phòng ban"
                  name="DepartmentId"
                  required
                  initialValue={assignmentDetail
                    .filter((s) => s.TargetType == _TargeType.ByDepartment)
                    .map((t) => t.Target)}
                >
                  <Select
                    showSearch
                    placeholder="Chọn phòng ban"
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      if (!option) return false;
                      return (option.label || "")
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }}
                    mode="multiple"
                    options={departmentList.map((ob) => ({
                      value: ob.Id,
                      label: ob.Name,
                    }))}
                  />
                </Form.Item>
              ) : assignment.AssignType == _TargeType.ByEmployee ? (
                <Form.Item
                  label="Chọn nhân viên"
                  name="EmployeeId"
                  required
                  initialValue={assignmentDetail
                    .filter((s) => s.TargetType == _TargeType.ByEmployee)
                    .map((t) => t.Target)}
                >
                  <Select
                    showSearch
                    placeholder="Chọn nhân viên"
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      if (!option) return false;
                      return (option.label || "")
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }}
                    mode="multiple"
                    options={employeeList.map((ob) => ({
                      value: ob.Id,
                      label: `${ob.Id} - ${ob.FirstName} ${ob.LastName}`,
                    }))}
                  />
                </Form.Item>
              ) : (
                <></>
              )}
              <Form.Item label="Từ ngày" required>
                <DatePicker
                  value={
                    assignment.StartDate ? dayjs(assignment.StartDate) : null
                  }
                  format={Config.DateFormat}
                  locale={locale}
                  // style={{ width: "100%" }}
                  inputReadOnly={true}
                  aria-readonly={true}
                  style={{ display: "inline-block", width: "calc(40%)" }}
                />
                <span
                  style={{
                    display: "inline-block",
                    lineHeight: "32px",
                    textAlign: "center",
                    marginRight: "12px",
                    marginLeft: "12px",
                  }}
                >
                  đến
                </span>
                <DatePicker
                  value={assignment.EndDate ? dayjs(assignment.EndDate) : null}
                  format={Config.DateFormat}
                  locale={locale}
                  inputReadOnly={true}
                  aria-readonly={true}
                  style={{ display: "inline-block", width: "calc(40%)" }}
                />
              </Form.Item>
              <Form.Item label="Giờ làm việc" required>
                <TimePicker
                  value={
                    shiftDetail.StartTime
                      ? dayjs(shiftDetail.StartTime, Config.TimeFormat)
                      : null
                  }
                  format={Config.NonSecondFormat}
                  locale={locale}
                  style={{ display: "inline-block", width: "calc(40%)" }}
                  inputReadOnly={true}
                  aria-readonly={true}
                />
                <span
                  style={{
                    display: "inline-block",
                    lineHeight: "32px",
                    textAlign: "center",
                    marginRight: "12px",
                    marginLeft: "12px",
                  }}
                >
                  đến
                </span>
                <TimePicker
                  value={
                    shiftDetail.FinishTime
                      ? dayjs(shiftDetail.FinishTime, Config.TimeFormat)
                      : null
                  }
                  format={Config.NonSecondFormat}
                  locale={locale}
                  inputReadOnly={true}
                  aria-readonly={true}
                  style={{ display: "inline-block", width: "calc(40%)" }}
                />
              </Form.Item>
              <Form.Item label="Giờ nghỉ">
                <TimePicker
                  value={
                    shiftDetail.BreakAt
                      ? dayjs(shiftDetail.BreakAt, Config.TimeFormat)
                      : null
                  }
                  format={Config.NonSecondFormat}
                  locale={locale}
                  style={{ display: "inline-block", width: "calc(40%)" }}
                  inputReadOnly={true}
                  aria-readonly={true}
                />
                <span
                  style={{
                    display: "inline-block",
                    lineHeight: "32px",
                    textAlign: "center",
                    marginRight: "12px",
                    marginLeft: "12px",
                  }}
                >
                  đến
                </span>
                <TimePicker
                  value={
                    shiftDetail.BreakEnd
                      ? dayjs(shiftDetail.BreakEnd, Config.TimeFormat)
                      : null
                  }
                  format={Config.NonSecondFormat}
                  locale={locale}
                  inputReadOnly={true}
                  aria-readonly={true}
                  style={{ display: "inline-block", width: "calc(40%)" }}
                />
              </Form.Item>
              <Form.Item label="Thời gian nghỉ">
                <InputNumber
                  value={shiftDetail.BreakMinutes}
                  addonAfter="phút"
                  readOnly
                />
              </Form.Item>
              <Form.Item label="Ngày trong tuần" required>
                <Checkbox.Group
                  value={
                    shiftDetail.DayIndexList ? shiftDetail.DayIndexList : []
                  }
                >
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
              <Form.Item
                label="Ghi chú"
                name="Note"
                initialValue={assignment.Note}
              >
                <TextArea
                  showCount
                  maxLength={1000}
                  style={{
                    height: 120,
                    marginBottom: 24,
                  }}
                />
              </Form.Item>
              <Form.Item>
                <div style={{ textAlign: "center" }}>
                  <Space style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="middle"
                      icon={<EditOutlined />}
                    >
                      Cập nhật
                    </Button>
                    <Button type="default" onClick={() => navigate(-1)}>
                      Hủy
                    </Button>
                  </Space>
                </div>
              </Form.Item>
            </Form>
          </Skeleton>
        </Spin>
      </Content>
    </Space>
  );
};
export { ShiftAssignmentPage, EditShiftAssignmentPage };
