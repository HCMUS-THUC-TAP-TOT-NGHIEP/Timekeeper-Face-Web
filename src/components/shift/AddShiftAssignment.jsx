import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Table,
  TimePicker,
  Tooltip,
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
// import { handleErrorOfRequest } from "../../utils/Helpers";
import { GetDepartmentList } from "../department/api";
import { GetManyEmployee } from "../employee/api";
import {
  GetAssignmentDetail,
  GetAssignmentType,
  GetShiftList,
  UpdateShiftAssignment,
  _TargeType,
} from "./api";

const AddShiftAssignmentPage = ({ notify, ...props }) => {
  const navigate = useNavigate();
  const [assignmentTypeList, setAssignmentTypeList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState({});
  const [shiftDetail, setShiftDetail] = useState({});
  const [editable, setEditable] = useState(props.editable || false);
  const [appliedDepartmentList, setAppliedDepartmentList] = useState([]);
  const [appliedEmployeeList, setAppliedEmployeeList] = useState([]);
  const [assignmentType, setAssignmentType] = useState(_TargeType.ByEmployee);
  const [form] = Form.useForm();

  const {
    token: { colorBgContainer, colorBgLayout },
  } = theme.useToken();
  async function loadData() {
    try {
      let response = await GetAssignmentType();
      if (response.Status == 1) {
        setAssignmentTypeList(response.ResponseData);
      } else {
        notify.error({
          message: "Không truy vấn được danh sách các kiểu phân ca",
          description: response.Description,
        });
      }
      response = await GetShiftList();
      if (response.Status == 1) {
        setShiftList(response.ResponseData.ShiftList);
      }
      return;
    } catch (error) {
      // handleErrorOfRequest({ error, notify });
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

  const onUpdatingAssigningShift = async (values) => {
    try {
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
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    setAssignmentType(assignment.TargetType);
  }, [assignment]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Space direction="horizontal" align="center">
              <Tooltip title="Quay lại">
                <Button
                  type="text"
                  icon={
                    <FontAwesomeIcon
                      icon={faArrowLeftLong}
                      style={{ fontSize: 20, margin: "auto" }}
                    />
                  }
                  onClick={() => navigate(-1)}
                  shape="circle"
                  size="large"
                />
              </Tooltip>
              <Typography.Title level={2} style={{ margin: 0 }}>
                Phân ca làm việc
              </Typography.Title>
            </Space>
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
          <Space>
            <Button onClick={() => navigate("/shift/assignment/list")}>
              Hủy
            </Button>
            <Button type="primary" onClick={() => form.submit()}>
              Lưu
            </Button>
          </Space>
        </Col>
      </Row>
      <Content style={{ background: colorBgContainer, padding: 20 }}>
        <Spin spinning={loading}>
          <Skeleton loading={loading}>
            <Form
              layout="horizontal"
              labelCol={{ sm: { span: 6 }, md: { span: 4 } }}
              wrapperCol={{ sm: { span: 18 }, md: { span: 20 } }}
              labelWrap
              onFinish={onUpdatingAssigningShift}
              labelAlign="left"
              form={form}
            >
              {/* region Thông tin chung */}

              <Typography.Title
                level={4}
                style={{
                  background: colorBgLayout,
                  padding: "4px 8px",
                }}
              >
                Thông tin chung
              </Typography.Title>
              <Form.Item
                label="Tên bảng phân ca"
                name="Description"
                required
                rules={[
                  {
                    required: true,
                    message: "Tên bảng phân ca là trường bắt buộc.",
                  },
                ]}
              >
                <Input placeholder="Nhập Tên bảng phân ca" />
              </Form.Item>
              <Form.Item label="Ghi chú" name="Note">
                <TextArea showCount rows={2} maxLength={1000} />
              </Form.Item>
              <Form.Item
                label="Chọn ca làm việc"
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
                  options={(shiftList || []).map((ob) => ({
                    value: ob.Id,
                    label: ob.Description,
                  }))}
                />
              </Form.Item>

              {/* endregion */}
              <Divider />
              {/* region Thời gian áp dụng */}

              <Typography.Title
                level={4}
                style={{
                  background: colorBgLayout,
                  padding: "4px 8px",
                }}
              >
                Thời gian áp dụng
              </Typography.Title>
              <Form.Item>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="StartDate"
                  required
                  style={{ display: "inline-block", width: "50%" }}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <DatePicker
                    format={Config.DateFormat}
                    locale={locale}
                    inputReadOnly={true}
                    aria-readonly={true}
                  />
                </Form.Item>
                <Form.Item
                  label="Ngày kết thúc"
                  name="EndDate"
                  required
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ display: "inline-block", width: "50%" }}
                >
                  <DatePicker
                    value={
                      shiftDetail.EndDate ? dayjs(shiftDetail.EndDate) : null
                    }
                    format={Config.DateFormat}
                    locale={locale}
                    inputReadOnly={true}
                    aria-readonly={true}
                  />
                </Form.Item>
              </Form.Item>
              {(shiftDetail || {}) !== {} ? (
                <>
                  <Form.Item>
                    <Form.Item
                      label="Giờ bắt đầu ca"
                      required
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      style={{ display: "inline-block", width: "50%" }}
                    >
                      <TimePicker
                        value={
                          shiftDetail.StartTime
                            ? dayjs(shiftDetail.StartTime, Config.TimeFormat)
                            : null
                        }
                        format={Config.NonSecondFormat}
                        locale={locale}
                        inputReadOnly={true}
                        aria-readonly={true}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Giờ kết thúc ca"
                      required
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      style={{ display: "inline-block", width: "50%" }}
                    >
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
                      />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item>
                    <Form.Item
                      label="Giờ bắt đầu nghỉ giữa ca"
                      // name="BreakAt"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      style={{ display: "inline-block", width: "50%" }}
                    >
                      <TimePicker
                        value={
                          shiftDetail.BreakAt
                            ? dayjs(shiftDetail.BreakAt, Config.TimeFormat)
                            : null
                        }
                        format={Config.NonSecondFormat}
                        locale={locale}
                        inputReadOnly={true}
                        aria-readonly={true}
                        placeholder=""
                      />
                    </Form.Item>
                    <Form.Item
                      label="Giờ kết thúc nghỉ giữa ca"
                      // name="BreakEnd"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      style={{ display: "inline-block", width: "50%" }}
                    >
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
                        placeholder=""
                      />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item
                    name="DaysInWeek"
                    label="Ngày trong tuần"
                    valuePropName="checked"
                    required
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
                </>
              ) : (
                <></>
              )}

              {/* endregion */}
              <Divider />
              {/* region Đối tượng áp dụng */}

              <Typography.Title
                level={4}
                style={{
                  background: colorBgLayout,
                  padding: "4px 8px",
                }}
              >
                Đối tượng áp dụng
              </Typography.Title>
              <Form.Item
                label="Kiểu phân ca"
                name="TargetType"
                required
                rules={[
                  {
                    required: true,
                    message: "Kiểu phân ca là trường bắt buộc.",
                  },
                ]}
                initialValue={assignmentType}
              >
                <Radio.Group
                  buttonStyle="solid"
                  onChange={(e) => setAssignmentType(e.target.value)}
                  options={assignmentTypeList.map((assignmentType) => ({
                    label: assignmentType.Name,
                    value: assignmentType.Id,
                  }))}
                />
              </Form.Item>
              <Form.Item wrapperCol={24}>
                <Space direction="vertical" style={{ maxWidth: "100%" }}>
                  <AppliedTargetTable
                    type={assignmentType}
                    notify={notify}
                    appliedDepartment={[
                      appliedDepartmentList,
                      setAppliedDepartmentList,
                    ]}
                    appliedEmployee={[
                      appliedEmployeeList,
                      setAppliedEmployeeList,
                    ]}
                  />
                  <Table
                    bordered
                    columns={
                      assignmentType == _TargeType.ByEmployee
                        ? employeeColumns
                        : departmentColumns
                    }
                    dataSource={
                      assignmentType == _TargeType.ByEmployee
                        ? appliedEmployeeList
                        : appliedDepartmentList
                    }
                    rowKey="Id"
                    scroll={{
                      x: 800,
                      y: 800,
                    }}
                    pagination={{
                      total:
                        assignmentType == _TargeType.ByEmployee
                          ? appliedEmployeeList.length
                          : appliedDepartmentList.length,
                      showSizeChanger: true,
                      showTotal: (total) => `Tổng ${total} bản ghi.`,
                      pageSizeOptions: [10, 25, 50],
                    }}
                  ></Table>
                </Space>
              </Form.Item>

              {/* endregion */}
            </Form>
          </Skeleton>
        </Spin>
      </Content>
    </Space>
  );
};

const departmentColumns = [
  {
    title: "#",
    width: 75,
    render: (_, rec, index) => index,
    align: "right",
  },
  {
    title: "Mã",
    dataIndex: "Id",
    width: 100,
  },
  {
    title: "Tên phòng ban",
    dataIndex: "Name",
  },
];
const employeeColumns = [
  {
    title: "#",
    width: 75,
    render: (_, rec, index) => index,
    align: "right",
  },
  {
    title: "Mã nhân viên",
    dataIndex: "Id",
    fixed: "left",
    width: 100,
  },
  {
    title: "Họ tên",
    render: (_, record) => `${record.LastName} ${record.FirstName}`,
    fixed: "left",
    width: 300,
  },
  {
    title: "Vị trí công việc",
    dataIndex: "Position",
    width: 300,
  },
  {
    title: "Phòng ban",
    dataIndex: "DepartmentName",
    width: 300,
  },
];

const AppliedTargetTable = (props) => {
  const { type, notify } = props;
  const {
    appliedEmployee: [appliedEmployeeList, setAppliedEmployeeList],
  } = props;
  const {
    appliedDepartment: [appliedDepartmentList, setAppliedDepartmentList],
  } = props;
  const [innerAppliedEmployeeList, setInnerAppliedEmployeeList] =
    useState(appliedEmployeeList);
  const [innerAppliedDepartmentList, setInnerAppliedDepartmentList] = useState(
    appliedDepartmentList
  );
  const [employeeList, setEmployeeList] = useState([]);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [deparmentList, setDepartmentList] = useState([]);
  const [totaldeparment, setTotalDeparment] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = (e) => {
    setAppliedEmployeeList(innerAppliedEmployeeList);
    setAppliedDepartmentList(innerAppliedDepartmentList);
    setInnerAppliedDepartmentList([]);
    setInnerAppliedEmployeeList([]);
    Modal.destroyAll();
    setOpen(false);
  };
  const handleCancel = (e) => {
    setInnerAppliedDepartmentList([]);
    setInnerAppliedEmployeeList([]);
    Modal.destroyAll();
    setOpen(false);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (type == _TargeType.ByDepartment) {
          const response = await GetDepartmentList();
          if (response.Status !== 1) {
            notify.error({
              message: "Truy vấn nhân phòng ban không thành công",
              description: response.Description,
            });
            return;
          }
          const { DepartmentList, Total } = response.ResponseData;
          setDepartmentList(DepartmentList);
          setTotalDeparment(Total);
        }
        if (type == _TargeType.ByEmployee) {
          const response = await GetManyEmployee();
          if (response.Status !== 1) {
            notify.error({
              message: "Truy vấn nhân viên không thành công",
              description: response.Description,
            });
            return;
          }
          const { EmployeeList, Total } = response.ResponseData;
          setEmployeeList(EmployeeList);
          setTotalEmployee(Total);
        }
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
    loadData();
  }, [type]);

  function createModel() {
    var title = "";
    var columns = [];
    var dataSource = [];
    var total = 0;
    var selectionObject = {};
    if (type == _TargeType.ByEmployee) {
      title = "Chọn nhân viên";
      columns = employeeColumns;
      dataSource = employeeList;
      total = totalEmployee;
      selectionObject = {
        type: "checkbox",
        onChange: (selectedRowKeys, selectedRows) => {
          setInnerAppliedEmployeeList(selectedRows);
        },
        defaultSelectedRowKeys: appliedEmployeeList.map((x) => x.Id),
      };
    } else if (type == _TargeType.ByDepartment) {
      title = "Chọn phòng ban";
      columns = departmentColumns;
      dataSource = deparmentList;
      total = totaldeparment;
      selectionObject = {
        type: "checkbox",
        onChange: (selectedRowKeys, selectedRows) => {
          setInnerAppliedDepartmentList(selectedRows);
        },
        defaultSelectedRowKeys: appliedDepartmentList.map((x) => x.Id),
      };
    }

    return (
      <Modal
        title={title}
        open={open}
        className="boxShadow89"
        okText="Chọn"
        cancelText="Hủy"
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          rowSelection={selectionObject}
          rowKey="Id"
          scroll={{
            x: 800,
            y: 800,
          }}
          pagination={{
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bản ghi.`,
            pageSizeOptions: [10, 25, 50],
          }}
        ></Table>
      </Modal>
    );
  }

  return (
    <>
      <Button onClick={showModal} icon={<PlusOutlined />}>
        Thêm
      </Button>
      {createModel()}
    </>
  );
};

export { AddShiftAssignmentPage };
