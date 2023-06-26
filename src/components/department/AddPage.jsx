import { InfoCircleTwoTone, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { GetManyEmployee } from "../employee/api";
import { CreateOneDepartment } from "./api";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

export const AddDepartmentFrom = function (props) {
  const [form] = Form.useForm();
  const [currentEmployeeList, setCurrentEmployeeList] = useState([]);
  const [insertOneDepartment, departmentList] = props.listState;
  const [notify, contextHolder] = notification.useNotification();
  const [processing, setProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
    Modal.destroyAll();
  };

  const onCloseModal = () => {
    form.resetFields();
    hideModal();
  };

  const onSubmit = (values) => {
    console.log(values);
    setProcessing(true);
    CreateOneDepartment(values)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          notification.success({
            description: "Thêm phòng ban thành công.",
          });
          values.Id = ResponseData.Id;
          var manager = currentEmployeeList.find(
            (employee) => employee.Id === values.ManagerId
          );
          values.ManagerName = `${manager.LastName} ${manager.FirstName}`;
          insertOneDepartment(values);
          hideModal();
          return;
        }
        notification.error({
          description: "Thêm phòng ban không thành công. " + Description,
        });
        return;
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
        setProcessing(true);
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  useEffect(() => {
    GetManyEmployee()
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          var { EmployeeList, Total } = ResponseData;
          setCurrentEmployeeList(EmployeeList);
          return;
        }
        notification.error({
          message: "Có lỗi",
          description:
            "Truy vấn danh sách nhân viên không thành công. " + Description,
        });
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      });
  }, []);

  const title = (
    <Space direction="horizontal" align="center" style={{ fontSize: 20 }}>
      <InfoCircleTwoTone />
      Tạo phòng ban mới
    </Space>
  );

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
        Tạo mới
      </Button>
      <Modal
        title={title}
        open={open}
        width={600}
        onCancel={onCloseModal}
        footer={[
          <Button type="default" onClick={onCloseModal}>
            Hủy
          </Button>,
          <Button
            type="primary"
            htmlType="submit"
            loading={processing}
            onClick={() => form.submit()}
          >
            Tạo phòng ban
          </Button>,
        ]}
      >
        <Form
          form={form}
          key="newForm"
          name="newForm"
          labelCol={{
            span: 8,
          }}
          onFinish={onSubmit}
          autoComplete="off"
          layout="vertical"
        >
          {contextHolder}
          <Form.Item
            hasFeedback
            labelCol={24}
            label="Tên"
            name="Name"
            rules={[
              {
                required: true,
                message: "Tên là trường bắt buộc.",
              },
              {
                validator: (_, value) => {
                  var exist = departmentList.find(
                    (department) => department.Name == value
                  );
                  if (!exist) return Promise.resolve();
                  return Promise.reject(
                    new Error(`${value} đã có trong danh sách phòng ban.`)
                  );
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item labelCol={24} label="Trưởng phòng" required>
            <Form.Item
              key={1}
              name="ManagerId"
              hidden
              rules={[
                {
                  required: true,
                  message: "Trưởng phòng là trường bắt buộc.",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item name="ManagerName" dependencies={["ManagerId"]}>
              <Space direction="horizontal">
                <EmployeeSelectionComponent
                  notify={notify}
                  optionList={currentEmployeeList}
                  form={form}
                />
              </Space>
            </Form.Item>
          </Form.Item>
          <Form.Item
            hasFeedback
            labelCol={24}
            label="Trạng thái"
            name="Status"
            initialValue="1"
            rules={[
              {
                required: true,
                message: "Trạng thái là trường bắt buộc.",
              },
            ]}
          >
            <Select>
              <Select.Option value="1">Hoạt động</Select.Option>
              <Select.Option value="0">Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export const EmployeeSelectionComponent = ({
  notify,
  selectedOption,
  setEmployee,
  form,
  department,
  ...rest
}) => {
  const [chosenOption, setChosenOption] = useState(selectedOption || {});
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentEmployeeList, setCurrentEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(40);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const loadData = async () => {
      setLoading(true);
      try {
        var response = await GetManyEmployee("POST", {
          page,
          perPage,
          department: department ? [department, null] : [null],
        });
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          const { EmployeeList, Total } = ResponseData;
          setTotal(Total);
          setCurrentEmployeeList(EmployeeList);
          return;
        }
        notify.error({
          message: "Truy vấn danh sách nhân viên không thành công",
          description: Description,
        });
      } catch (error) {
        handleErrorOfRequest({ notify, error });
      } finally {
        setLoading(false);
      }
    };
    loadData();
    return () => {
      setCurrentEmployeeList([]);
    };
  }, [page, perPage, department, open, reloading]);

  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    form.setFieldsValue({ ManagerId: chosenOption.Id });
    setOpen(false);
  };
  const Columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "Id",
      with: 50,
      sorter: (a, b) => a.Id - b.Id,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "FullName",
      with: 300,
    },
    {
      title: "Phòng ban hiện tại",
      dataIndex: "DepartmentName",
      with: 300,
    },
  ];

  const title = (
    <Space direction="horizontal" align="center" style={{ fontSize: 20 }}>
      <InfoCircleTwoTone />
      Danh sách nhân viên
    </Space>
  );

  return (
    <>
      <Space>
        <Input
          value={
            chosenOption
              ? chosenOption.FullName ||
                `${chosenOption.LastName || ""} ${
                  chosenOption.FirstName || ""
                } `
              : ""
          }
          readOnly
        />
        <Button type="link" onClick={showModal}>
          Chọn...
        </Button>
      </Space>
      <Modal
        title={title}
        open={open}
        onOk={hideModal}
        onCancel={hideModal}
        okText="Chọn"
        cancelText="Hủy"
        width={900}
      >
        <Space direction="vertical" size="large">
          <Row justify={"end"}>
            <Col>
              <Button
                loading={loading}
                onClick={() => setReloading(!reloading)}
                style={{
                  backgroundColor: "#ec5504",
                  border: "1px solid #ec5504",
                }}
                type="primary"
                icon={
                  <FontAwesomeIcon
                    icon={faArrowsRotate}
                    style={{ paddingRight: "8px" }}
                  />
                }
              >
                Lấy lại dữ liệu
              </Button>
            </Col>
          </Row>
          <Table
            loading={loading}
            scroll={{
              x: 700,
              y: 700,
            }}
            columns={Columns}
            rowKey="Id"
            rowSelection={{
              type: "radio",
              onChange: (selectedRowKeys, selectedRows) => {
                try {
                  setChosenOption(selectedRows[0]);
                } catch (error) {
                  setChosenOption({});
                }
              },
              defaultSelectedRowKeys: [chosenOption.Id],
            }}
            dataSource={currentEmployeeList}
            pagination={{
              onChange: (page, pageSize) => {
                setPage(page);
                setPerPage(pageSize);
              },
              pageSizeOptions: [10, 15, 25, 50],
              showSizeChanger: true,
              showTotal: (total, range) => `Tổng số bản ghi: ${total}`,
            }}
          ></Table>
        </Space>
      </Modal>
    </>
  );
};
