import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
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
  Table,
  Tag,
  Tooltip,
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
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthState } from "../../Contexts/AuthContext";
import Config from "../../constant";
import { CreatTimesheetBE, GetTimesheetList } from "./api";
dayjs.extend(isSameOrBefore);

const TimesheetTablePage = ({ notify, loginRequired, ...rest }) => {
  const userDetails = useAuthState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timesheetList, setTimesheetList] = useState([]);
  const [total, setTotal] = useState(0);
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadData();
  }, [page, pageSize]);
  async function loadData() {
    try {
      setLoading(true);
      var response = await GetTimesheetList({
        Page: page,
        PageSize: pageSize,
        Keyword: "",
      });
      if (response.Status == 1) {
        const { ResponseData } = response;
        setTotal(ResponseData.Total);
        setTimesheetList(ResponseData.TimesheetList);
        return;
      }
      notify.error({
        message: "",
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
      setLoading(false);
    }
  }

  const search = async (value) => {
    setSearching(true);
    console.log(value);
  };

  const insertReportFE = (value) => {
    if (timesheetList.length < pageSize) {
      setTimesheetList([...timesheetList, value]);
    }
  };

  const deleteReportFE = (value) => {
    var reportList = reportList.filter((a) => a.Id !== value.Id);
    if (reportList.length < pageSize) {
      //todo get total report
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
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
      <Row wrap>
        <Col flex="none">
          <Search
            placeholder="Tìm kiếm"
            // onSeacrh={search}
            allowClear={true}
            loading={searching}
            enterButton
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
      <Content>
        <Table
          loading={loading}
          className="boxShadow89"
          bordered
          scroll={{
            x: "calc(700px + 50%)",
            y: 1000,
          }}
          style={{ borderColor: "black" }}
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
          rowSelection={{
            type: "none",
            onSelect: (record) =>
              navigate(`/timesheet/timekeeping/timesheet-detail/${record.Id}`),
          }}
          onRow={(data, index) => {
            console.log(data, index);
          }}
        >
          <Column
            key="DateRange"
            title="Thời gian"
            // dataIndex="DateRange"
            width={120}
            render={(_, record) =>
              `${dayjs(record.DateFrom).format(Config.DateFormat)} - ${dayjs(
                record.DateTo
              ).format(Config.DateFormat)}`
            }
            fixed="left"
          />
          <Column
            key="Name"
            title="Tên bảng chấm công"
            dataIndex="Name"
            width={250}
            fixed="left"
          />
          <Column key="Type" title="Chấm công" dataIndex="Type" width={100} />
          <Column
            key="Department"
            title="Vị trí công việc"
            width={100}
            render={(_, record) => {
              return record.DepartmentList.length == 0
                ? "Tất cả"
                : record.DepartmentList.join(";");
            }}
          />
          <Column
            key="LockedStatus"
            title="Trạng thái"
            dataIndex="LockedStatus"
            width={100}
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
          />
          <Column
            key="Action"
            title=""
            width={40}
            render={(_, record, index) => {
              return (
                <DeleteReportComponent
                  notify={notify}
                  report={record}
                  deleteReportFE={deleteReportFE}
                />
              );
            }}
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
    } catch (error) {
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
        <Typography.Text strong>{report.Name}</Typography.Text>
        không?
      </Modal>
    </>
  );
};

const AddReportComponent = ({ notify, insertReportFE, ...rest }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [designationOptions, setDesignationOptions] = useState([
    {
      Id: 0,
      Name: "Tất cả vị trí",
    },
  ]);
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
      setLoading(true);
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
      console.error(error);
    } finally {
      setLoading(false);
      Modal.destroyAll();
    }
  };
  return (
    <>
      <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>
        Thêm
      </Button>
      <Modal
        title="Thêm bảng chấm công chi tiết"
        maskClosable={true}
        onCancel={hideModal}
        open={open}
        footer={[
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
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
            initialValue={[0]}
          >
            <Select
              mode="multiple"
              options={(designationOptions || []).map((option) => ({
                value: option.Id,
                label: option.Name,
              }))}
              showSearch={true}
            />
          </Form.Item>
          <Form.Item label="Tên bảng chấm công" name="Name" key="Name" required>
            <TextArea rows={3}></TextArea>
          </Form.Item>
          <Form.Item label="Thời gian" key="Time" required>
            <Form.Item key="select">
              <Select defaultValue={0}>
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
      </Modal>
    </>
  );
};

export { TimesheetTablePage };
