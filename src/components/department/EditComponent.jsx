import { EditTwoTone } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Tooltip,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { GetManyEmployee } from "../employee/api";
import { EmployeeSelectionComponent } from "./AddComponent";
import { UpdateOneDepartment } from "./api";
import { useForm } from "antd/es/form/Form";

export const EditDepartmentForm = function (props) {
  const [form] = useForm();
  const department = props.content;
  const [updateOneDepartment, departmentList] = props.listState;
  const [currentEmployeeList, setCurrentEmployeeList] = useState([]);
  const [notify, contextHolder] = notification.useNotification();
  const [processing, setProcessing] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setProcessing(true);
    form.setFieldsValue({
      Id: department.Id,
      Name: department.Name,
      Status: department.Status,
      ManagerId: department.ManagerId,
    });
    GetManyEmployee()
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          setCurrentEmployeeList(ResponseData.EmployeeList);
          form.setFieldsValue({ ManagerId: department.ManagerId });
          return;
        }
        notify.error({
          message: "Có lỗi",
          description: Description,
        });
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      })
      .finally(() => {
        setProcessing(false);
      });
  }, [department, open]);

  const onSubmit = (values) => {
    UpdateOneDepartment(values)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          var manager = currentEmployeeList.find(
            (employee) => employee.Id === values.ManagerId
          );
          values.ManagerName = `${manager.LastName} ${manager.FirstName}`;
          updateOneDepartment(values);
          notify.success({
            description: "Chỉnh sửa thành công",
          });
          hideModal();
          return;
        }
        notify.error({
          message: "Có lỗi",
          description:
            "Truy vấn danh sách nhân viên không thành công. " + Description,
        });
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      });
  };

  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
    Modal.destroyAll();
  };
  const title = (
    <Space direction="horizontal" align="center" style={{ fontSize: 20 }}>
      <EditTwoTone />
      Chỉnh sửa phòng ban
    </Space>
  );

  return (
    <>
      {contextHolder}
      <Tooltip title="Chỉnh sửa" placement="bottom">
        <Button
          size="small"
          icon={<EditTwoTone />}
          type="text"
          shape="circle"
          onClick={showModal}
        />
      </Tooltip>
      <Modal
        title={title}
        open={open}
        width={600}
        onCancel={hideModal}
        footer={[
          <Button type="default" onClick={hideModal}>
            Hủy
          </Button>,
          <Button
            type="primary"
            htmlType="submit"
            loading={processing}
            onClick={() => form.submit()}
          >
            Cập nhật
          </Button>,
        ]}
      >
        <Form
          form={form}
          key="editForm"
          name="editForm"
          labelCol={{
            span: 8,
          }}
          onFinish={onSubmit}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            hasFeedback
            labelCol={24}
            label="Mã Phòng Ban"
            name="Id"
            rules={[
              {
                required: true,
                message: "Mã Phòng Ban là trường bắt buộc.",
              },
            ]}
          >
            <Input readOnly />
          </Form.Item>
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
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item labelCol={24} label="Trưởng phòng" required>
            <Form.Item
              key={1}
              name="ManagerId"
              rules={[
                {
                  required: true,
                  message: "Trưởng phòng là trường bắt buộc.",
                },
              ]}
              hidden
            >
              <InputNumber />
            </Form.Item>
            <Space direction="horizontal">
              <EmployeeSelectionComponent
                notify={notify}
                selectedOption={{
                  Id: department.ManagerId || null,
                  FullName: department.ManagerName,
                }}
                form={form}
                department={form.getFieldValue("Id")}
              />
            </Space>
          </Form.Item>
          <Form.Item
            hasFeedback
            labelCol={24}
            label="Trạng thái"
            name="Status"
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
