import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
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
dayjs.extend(isSameOrBefore);

const TimesheetDetailPage = ({ notify, loginRequired, ...rest }) => {
  const userDetails = useAuthState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportList, setReportList] = useState([]);
  const [total, setTotal] = useState(0);
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const search = async (value) => {
    setSearching(true);
    console.log(value);
  };

  const insertReportFE = (value) => {
    if (reportList.length < pageSize) {
      setReportList([...reportList, value]);
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
              onClick={() => setPage(1)}
              icon={<UndoOutlined />}
              // loading={loading}
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
          dataSource={reportList}
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
          <Column title="Thời gian" dataIndex="DateRange" width={120} />
          <Column title="Tên bảng chấm công" dataIndex="Name" width={250} />
          <Column title="Chấm công" dataIndex="Type" width={100} />
          <Column title="Vị trí công việc" dataIndex="Type" width={100} />
          <Column title="Trạng thái" dataIndex="Status" width={100} />
          <Column
            title=""
            width={100}
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
  const [designationOptions, setDesignationOptions] = useState([
    {
      Id: 0,
      Name: "Tất cả vị trí",
    },
  ]);
  const [dateRange, setDateRange] = useState([dayjs().date(1), dayjs()]);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      Name: `Bảng chấm công từ ngày ${dateRange[0].format(
        Config.DateFormat
      )} đến ngày ${dateRange[1].format(Config.DateFormat)}`,
    });
  }, [dateRange]);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };
  const insertReport = async () => {
    try {
      setLoading(true);
    } catch (error) {
    } finally {
      setLoading(false);
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
          layout="horizontal"
          form={form}
          onFinish={insertReport}
          labelCol={{ sm: { span: 8 }, md: { span: 8 } }}
          wrapperCol={{ sm: { span: 16 }, md: { span: 16 } }}
          labelWrap
          labelAlign="left"
        >
          <Form.Item
            label="Vị trí công việc"
            name="DesignationList"
            key="DesignationList"
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
              initialValue={dateRange}
              key="DateRange"
              style={{ width: "100%" }}
            >
              <DatePicker.RangePicker
                onChange={(value) => setDateRange(value)}
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

export { TimesheetDetailPage };
