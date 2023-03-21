import { PlusOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Select,
  Skeleton,
  Space,
  theme
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import TextArea from "antd/es/input/TextArea";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GetDepartmentList } from "../department/api";
import { GetManyEmployee } from "../employee/api";
import {
  AssignShift,
  GetAssignmentDetail,
  GetAssignmentType,
  GetDesignationList,
  GetShiftList,
  GetShiftType, UpdateShiftAssignment
} from "./api";

const dateFormat = "YYYY-MM-DD";
const ShiftAssignmentPage = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [notify, contextHolder] = notification.useNotification();
  const [assignmentTypeList, setAssignmentTypeList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const assignShift = (values) => {
    console.log(values);
    if (values.StartDate) {
      values.StartDate = dayjs(values.StartDate).format(dateFormat);
    }
    if (values.EndDate) {
      values.EndDate = dayjs(values.EndDate).format(dateFormat);
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
          message: "Thất bại",
          description: Description,
        });
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
      });
  };
  useEffect(() => {
    async function loadData() {
      const response1 = await GetAssignmentType();
      const response2 = await GetShiftList();
      const response3 = await GetDepartmentList();
      const response4 = await GetDesignationList();
      const response5 = await GetManyEmployee();
      setAssignmentTypeList(response1.ResponseData);
      setShiftList(response2.ResponseData);
      setDepartmentList(response3.ResponseData);
      setDesignationList(response4.ResponseData);
      setEmployeeList(response5.ResponseData);
    }
    loadData();
  }, []);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/shift">Quản lý ca làm việc</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="">Phân ca</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button type="primary" icon={<PlusOutlined />}>
            Tạo phân ca mới
          </Button>
        </Col>
      </Row>
      <Content style={{ background: colorBgContainer, padding: 20 }}>
        <Form form={form} layout="vertical" onFinish={assignShift}>
          <Row gutter={24}>
            <Col xs={24} sm={12} key="1">
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
            </Col>
            <Col xs={24} sm={12} key="2">
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
                <Select
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
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} key="3">
              <Form.Item
                label="Loại ca"
                name="ShiftId"
                required
                rules={[
                  {
                    required: true,
                    message: "Loại ca ca là trường bắt buộc.",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn loại ca"
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
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} key="4">
              <Form.Item label="Phòng ban" name="DepartmentId">
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
            </Col>
            <Col xs={24} key="6">
              <Form.Item label="Chọn nhân viên" name="EmployeeId">
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
            </Col>
            <Col xs={24} sm={12} key="7">
              <Form.Item
                label="Từ ngày"
                name="StartDate"
                rules={[
                  {
                    required: true,
                    message: "Từ ngày là trường bắt buộc chọn.",
                  },
                ]}
              >
                <DatePicker
                  allowClear
                  format="DD/MM/YYYY"
                  locale={locale}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} key="8">
              <Form.Item label="đến ngày" name="EndDate">
                <DatePicker
                  allowClear
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  locale={locale}
                />
              </Form.Item>
            </Col>
            <Col span={24} key="9">
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
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="middle">
                  Cập nhật
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Content>
    </Space>
  );
};

const EditShiftAssignmentPage = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [notify, contextHolder] = notification.useNotification();
  const [assignmentTypeList, setAssignmentTypeList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shiftAssignment, setShiftAssignment] = useState({});
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const assignShift = (values) => {
    console.log(values);
    if (values.StartDate) {
      values.StartDate = dayjs(values.StartDate).format(dateFormat);
    }
    if (values.EndDate) {
      values.EndDate = dayjs(values.EndDate).format(dateFormat);
    }
    console.log(values);
    UpdateShiftAssignment(values)
      .then((response) => {
        console.log(response);
        const { Status, ResponseData, Description } = response;
        if (Status === 1) {
          notify.success({
            description: "Cập nhật phân ca thành công.",
          });
          navigate("/shift/assignment/detail/" + ResponseData.Id);
          return;
        }
        notify.error({
          message: "Thất bại",
          description: Description,
        });
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
        setShiftAssignment(response.ResponseData);
        console.log(
          response.ResponseData.Detail.filter((s) => s.TargetType == 1)
        );
        form.setFieldsValue({
          Id: response.ResponseData.Id,
          Description: response.ResponseData.Description,
          AssignType: response.ResponseData.AssignType,
          ShiftId: response.ResponseData.ShiftId,
          StartDate: dayjs(response.ResponseData.StartDate, "YYYY-MM-DD"),
          EndDate: dayjs(response.ResponseData.EndDate, "YYYY-MM-DD"),
          Note: response.ResponseData.Note,
          DepartmentId: response.ResponseData.Detail.filter(
            (s) => s.TargetType == 1
          ).map((t) => t.Target),
          DepartmentId: [2],
          EmployeeId: response.ResponseData.Detail.filter(
            (s) => s.TargetType == 2
          ).map((t) => t.Target),
        });
      } catch (error) {
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
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/shift">Quản lý ca làm việc</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="">Phân ca</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}></Col>
      </Row>
      <Content style={{ background: colorBgContainer, padding: 20 }}>
        <Form form={form} layout="vertical" onFinish={assignShift}>
          <Row gutter={24}>
            <Skeleton loading={loading} active={loading}>
            <Col xs={24} sm={12} key="0">
                <Form.Item
                  label="Mã"
                  name="Id"
                  required
                >
                  <Input disabled placeholder="Nhập tiêu đề" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} key="1">
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
              </Col>
              <Col xs={24} sm={12} key="2">
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
                  <Select
                    disabled
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
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} key="3">
                <Form.Item
                  label="Loại ca"
                  name="ShiftId"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Loại ca ca là trường bắt buộc.",
                    },
                  ]}
                >
                  <Select
                    disabled
                    showSearch
                    placeholder="Chọn loại ca"
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
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} key="4">
                <Form.Item label="Phòng ban" name="DepartmentId">
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
              </Col>
              <Col xs={24} key="6">
                <Form.Item label="Chọn nhân viên" name="EmployeeId">
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
              </Col>
              <Col xs={24} sm={12} key="7">
                <Form.Item
                  label="Từ ngày"
                  name="StartDate"
                  rules={[
                    {
                      required: true,
                      message: "Từ ngày là trường bắt buộc chọn.",
                    },
                  ]}
                >
                  <DatePicker
                    disabled
                    allowClear
                    format="DD/MM/YYYY"
                    locale={locale}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} key="8">
                <Form.Item label="đến ngày" name="EndDate">
                  <DatePicker
                    allowClear
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    locale={locale}
                  />
                </Form.Item>
              </Col>
              <Col span={24} key="9">
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
              </Col>
            </Skeleton>
          </Row>
          <Space wrap>
            <Button
              type="primary"
              onClick={() => navigate("/shift/assignment")}
            >
              Mới
            </Button>
            {/* <Form.Item>
              <Button type="primary" htmlType="submit" size="middle">
                Cập nhật
              </Button>
            </Form.Item> */}
            <Button type="primary" htmlType="submit" size="middle">
              Cập nhật
            </Button>
            <Button type="primary" onClick={() => navigate(-1)}>
              Hủy
            </Button>
          </Space>
        </Form>
      </Content>
    </Space>
  );
};
export { ShiftAssignmentPage, EditShiftAssignmentPage };

