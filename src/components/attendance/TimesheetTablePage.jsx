import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  faFileCirclePlus,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  TreeSelect,
  Typography,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import Search from "antd/es/input/Search";
import TextArea from "antd/es/input/TextArea";
import { Content } from "antd/es/layout/layout";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import Config from "../../constant";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { GetDepartmentList } from "../department/api";
import { CreatTimesheetBE, DeleteTimesheetBE, GetTimesheetList } from "./api";
const { SHOW_PARENT } = TreeSelect;
dayjs.extend(isSameOrBefore);

const TimesheetTablePage = ({ notify, loginRequired, ...rest }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(true);
  const [timesheetList, setTimesheetList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInputRef = useRef();
  const { authorization } = useAuthState();
  const UserPermission = authorization.Timesheet || null;

  useEffect(() => {
    loadData();
  }, [page, pageSize, reloading]);
  async function loadData() {
    try {
      setLoading(true);
      let searchString = searchInputRef.current
        ? searchInputRef.current.input.value
        : "";
      var response = await GetTimesheetList({
        Page: page,
        PageSize: pageSize,
        Keyword: searchString,
      });
      if (response.Status == 1) {
        const { ResponseData } = response;
        setTotal(ResponseData.Total);
        setTimesheetList(ResponseData.TimesheetList);
        return;
      }
      throw new Error(response.Description);
    } catch (error) {
      handleErrorOfRequest({ notify, error });
    } finally {
      setLoading(false);
    }
  }

  const insertReportFE = (value) => {
    if (timesheetList.length < pageSize) {
      setTimesheetList([...timesheetList, value]);
    }
  };

  const deleteReportFE = async (value) => {
    await loadData();
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Bảng chấm công chi tiết
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <NavLink to="/">Dashboard</NavLink>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <NavLink to="">Bảng chấm công chi tiết</NavLink>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <AddReportComponent notify={notify} insertReportFE={insertReportFE} />
        </Col>
      </Row>
      <Content style={{ paddingTop: 10 }}>
        <Row style={{ marginBottom: 16 }} wrap>
          <Col flex="none">
            <Search
              placeholder="Tìm kiếm"
              ref={searchInputRef}
              onSearch={(value) => {
                setReloading(!reloading);
              }}
              allowClear={true}
              enterButton
              style={{ width: 400, maxWidth: "100%" }}
            />
          </Col>
          <Col flex="auto" style={{ textAlign: "right" }}>
            <Tooltip title="Tải lại" placement="bottom">
              <Button
                type="primary"
                onClick={loadData}
                icon={<UndoOutlined />}
                loading={loading}
                style={{
                  backgroundColor: "#ec5504",
                  border: "1px solid #ec5504",
                }}
              >
                Tải lại
              </Button>
            </Tooltip>
          </Col>
        </Row>
        <Table
          className="boxShadow0 rounded"
          loading={loading}
          bordered
          scroll={{
            x: "calc(700px + 50%)",
            y: 1000,
          }}
          dataSource={timesheetList}
          rowKey="Id"
          locale={locale}
          pagination={{
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
            showTotal: (total) => `Tổng ${total} mục`,
          }}
        >
          <Column
            title="Stt"
            render={(_, __, index) => index + 1}
            align="right"
            width={40}
          />
          <Column
            key="DateRange"
            title="Thời gian"
            align="center"
            width={80}
            render={(_, record) =>
              `${dayjs(record.DateFrom).format(Config.DateFormat)} - ${dayjs(
                record.DateTo
              ).format(Config.DateFormat)}`
            }
          />
          <Column
            key="Name"
            title="Tên bảng chấm công"
            width={180}
            render={(_, record) => (
              <NavLink
                to={`/timesheet/timekeeping/timesheet-detail/${record.Id}`}
              >
                {record.Name}
              </NavLink>
            )}
          />
          <Column
            key="Department"
            title="Vị trí công việc"
            width={100}
            render={(_, record) => {
              return record.DepartmentNameList.length == 0
                ? "Tất cả"
                : record.DepartmentNameList.join("; ");
            }}
          />
          <Column
            key="LockedStatus"
            title="Trạng thái"
            dataIndex="LockedStatus"
            width={80}
            render={(_, record) => {
              return record.LockedStatus ? (
                <Tag
                  icon={
                    <FontAwesomeIcon
                      icon={faLock}
                      style={{ paddingRight: "8px" }}
                    />
                  }
                >
                  Đã khóa
                </Tag>
              ) : (
                <Tag
                  icon={
                    <FontAwesomeIcon
                      icon={faLockOpen}
                      style={{ paddingRight: "8px" }}
                    />
                  }
                >
                  Chưa khóa
                </Tag>
              );
            }}
            align="center"
          />
          <Column
            key="Action"
            title=""
            width={40}
            align="center"
            render={(_, record, index) => {
              return (
                <DeleteReportComponent
                  notify={notify}
                  report={record}
                  deleteReportFE={deleteReportFE}
                />
              );
            }}
            fixed="right"
          />
        </Table>
      </Content>
    </Space>
  );
};

const DeleteReportComponent = ({ notify, report, deleteReportFE, ...rest }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };
  const deleteReport = async () => {
    try {
      setLoading(true);
      var response = await DeleteTimesheetBE({ Id: report.Id });
      if (response.Status === 1) {
        await deleteReportFE(report);
        notify.success({
          message: <b>Thông báo</b>,
          description: `Đã xóa ${report.Name}`,
        });
        hideModal();
        return;
      }
      notify.error({
        message: <b>Thông báo</b>,
        description: response.Description,
      });
    } catch (error) {
      handleErrorOfRequest({ notify, error });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Tooltip title="Xóa" placement="bottom">
        <Button
          icon={<DeleteOutlined />}
          danger
          shape="circle"
          onClick={showModal}
          type="text"
        />
      </Tooltip>
      <Modal
        open={open}
        title="Cảnh báo"
        onCancel={hideModal}
        okButtonProps={{ loading: loading, danger: true }}
        okText="Xoá"
        cancelText="Hủy"
        onOk={deleteReport}
      >
        Bạn có chắc chắn muốn xóa
        <Typography.Text strong> {report.Name} </Typography.Text>
        không?
      </Modal>
    </>
  );
};

const AddReportComponent = ({ notify, insertReportFE, ...rest }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const [optionList, setOptionList] = useState([
    {
      title: "Tất cả vị trí",
      value: 0,
      key: 0,
      children: [],
    },
  ]);
  const [value, setValue] = useState([0]);
  const onChange = (newValue) => {
    console.log("onChange ", value);
    setValue(newValue);
  };
  useEffect(() => {
    if (!open) {
      setOptionList([
        {
          title: "Tất cả vị trí",
          value: 0,
          key: 0,
          children: [],
        },
      ]);
      return;
    }
    loadData();
  }, [open]);

  const loadData = async () => {
    try {
      setLoading(true);
      let response = await GetDepartmentList();
      if (response.Status === 1) {
        let { DepartmentList } = response.ResponseData;
        let option = optionList[0];
        console.log(option);
        option.children = [];
        DepartmentList.forEach((department) => {
          option.children.push({
            // key: department.Id,
            title: department.Name,
            value: department.Id,
          });
        });
        setOptionList([option]);
        return;
      }
      throw new Error(response.Description);
    } catch (error) {
      handleErrorOfRequest({ error, notify });
    } finally {
      setLoading(false);
    }
  };
  const [form] = Form.useForm();
  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
    Modal.destroyAll();
  };
  const insertReport = async (values) => {
    try {
      setProcessing(true);
      var response = await CreatTimesheetBE(values);
      if (response.Status === 1) {
        notify.success({
          message: (
            <p>
              Đã tạo báo cáo chấm công: <b>{values.Name}</b>
            </p>
          ),
        });
        navigate(
          `/timesheet/timekeeping/timesheet-detail/${response.ResponseData.Id}`
        );
        return;
      }

      notify.error({
        message: <p>Không thành công</p>,
        description: response.Description,
      });
    } catch (error) {
      handleErrorOfRequest({ notify, error });
    } finally {
      setProcessing(false);
      Modal.destroyAll();
    }
  };
  const changeDateRangeSelect = (value) => {
    switch (value) {
      case 0:
        form.setFieldValue("DateRange", [dayjs().startOf("month"), dayjs()]);
        form.setFieldsValue({
          Name: `Bảng chấm công từ ngày ${dayjs()
            .startOf("month")
            .format(Config.DateFormat)} đến ngày ${dayjs().format(
            Config.DateFormat
          )}`,
        });

        break;
      case 1:
        form.setFieldValue("DateRange", [
          dayjs().subtract(1, "month").startOf("month"),
          dayjs().subtract(1, "month").endOf("month"),
        ]);
        form.setFieldsValue({
          Name: `Bảng chấm công từ ngày ${dayjs()
            .subtract(1, "month")
            .startOf("month")
            .format(Config.DateFormat)} đến ngày ${dayjs()
            .subtract(1, "month")
            .endOf("month")
            .format(Config.DateFormat)}`,
        });

        break;
      default:
        break;
    }
  };
  const title = (
    <Space direction="horizontal" align="center" style={{ fontSize: 20 }}>
      <FontAwesomeIcon icon={faFileCirclePlus} opacity={1} fillOpacity={0.4} />
      Thêm bảng chấm công chi tiết
    </Space>
  );
  return (
    <>
      <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>
        Thêm
      </Button>
      <Modal
        title={title}
        maskClosable={true}
        onCancel={hideModal}
        open={open}
        footer={[
          <Button
            type="primary"
            htmlType="submit"
            loading={processing}
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            key="submit"
          >
            Lưu
          </Button>,
          <Button type="default" key="cancel" onClick={hideModal}>
            Hủy
          </Button>,
        ]}
        style={{ maxWidth: "100%" }}
        width={800}
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="horizontal"
            onFinish={insertReport}
            labelCol={{ sm: { span: 8 }, md: { span: 8 } }}
            wrapperCol={{ sm: { span: 16 }, md: { span: 16 } }}
            labelWrap
            labelAlign="left"
            initialValues={{
              DateRange: [dayjs().date(1), dayjs()],
              Name: `Bảng chấm công từ ngày ${dayjs()
                .date(1)
                .format(Config.DateFormat)} đến ngày ${dayjs().format(
                Config.DateFormat
              )}`,
            }}
          >
            <Form.Item
              label="Vị trí công việc"
              name="DepartmentList"
              key="DepartmentList"
              required
            >
              <TreeSelect
                // treeDataSimpleMode={true}
                treeData={optionList}
                // treeData={treeData}
                treeCheckable={true}
                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                showSearch={true}
                loading={loading}
                treeNodeLabelProp="title"
                treeDefaultExpandAll={true}
                multiple={true}
              ></TreeSelect>
            </Form.Item>
            <Form.Item
              label="Tên bảng chấm công"
              name="Name"
              key="Name"
              required
            >
              <TextArea rows={3}></TextArea>
            </Form.Item>
            <Form.Item label="Thời gian" key="Time" required>
              <Form.Item key="select">
                <Select defaultValue={0} onChange={changeDateRangeSelect}>
                  <Select.Option key={0} value={0}>
                    Tháng này
                  </Select.Option>
                  <Select.Option key={1} value={1}>
                    Tháng trước
                  </Select.Option>
                  <Select.Option key={2} value={2}>
                    Tùy chọn
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="DateRange"
                wrapperCol={24}
                key="DateRange"
                style={{ width: "100%" }}
              >
                <DatePicker.RangePicker
                  onChange={(value) => {
                    form.setFieldsValue({
                      Name: `Bảng chấm công từ ngày ${value[0].format(
                        Config.DateFormat
                      )} đến ngày ${value[1].format(Config.DateFormat)}`,
                    });
                  }}
                  locale={locale}
                  format={Config.DateFormat}
                />
              </Form.Item>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export { TimesheetTablePage };
