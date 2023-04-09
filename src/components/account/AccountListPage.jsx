import { FilterFilled, SearchOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Table,
  notification,
} from "antd";
import { Content } from "antd/es/layout/layout";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import Config from "../../constant";
import { compareDatetime, compareString } from "../../utils";
import { AddAccount } from "./AddAccount";
import { DeleteAccount } from "./DeleteAccount";
import { EditAccount } from "./EditAccount";
import { GetAccountList } from "./api";

export const AccountListPage = (props) => {
  const [form] = Form.useForm();
  const [notify, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(true);
  const [accountList, setAccountList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    document.title = "Danh mục người dùng";
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        var response = await GetAccountList({
          Page: currentPage,
          PerPage: pageSize,
        });
        const { Status, ResponseData, Description } = response;
        if (Status === 1) {
          const { AccountList, Total } = ResponseData;
          for (var ob of AccountList) {
            ob.key = ob.Id;
          }
          setAccountList(AccountList);
          setTotal(Total);
          // setTotalPages(TotalPages);
          return;
        }
        notify.error({
          message: "Không thành công",
          description: Description,
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
  }, [currentPage, pageSize, notify]);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterFilled
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(
          () => (searchInput.current ? searchInput.current.input : undefined),
          100
        );
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const insertAccount = (value) => {
    if (accountList.length < pageSize) setAccountList([...accountList, value]);
  };
  const deleteAccount = (value) => {
    setAccountList(
      accountList.filter((account) => account.Username !== value.Username)
    );
  };
  const editAccount = (value) => {
    const updatedList = accountList.map((account) => {
      if (account.Id === value.Id) {
        return value;
      } else {
        return account;
      }
    });
    setAccountList(updatedList);
  };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/manage/account">Quản lý người dùng</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="">Danh sách người dùng</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <AddAccount insertFE={insertAccount} />
        </Col>
      </Row>
      <Content style={{ paddingTop: 20 }}>
        <Table
          loading={loading}
          bordered
          scroll={{ x: 500 }}
          dataSource={accountList}
          pagination={{
            position: ["bottomRight"],
            pageSize: pageSize,
            total: total,
            current: currentPage,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
            pageSizeOptions: [10, 15, 20],
          }}
          rowSelection={{
            type: "checkbox",
          }}
        >
          <Column
            title="Username"
            dataIndex="Username"
            key="Username"
            sorter={(a, b) => compareString(a, b, "Username")}
            {...getColumnSearchProps("Username")}
            width={100}
          />
          <Column
            title="Email"
            dataIndex="EmailAddress"
            key="EmailAddress"
            sorter={(a, b) => compareString(a, b, "EmailAddress")}
            {...getColumnSearchProps("EmailAddress")}
            width={300}
          />
          <Column
            title="Tên"
            dataIndex="Name"
            key="Name"
            sorter={(a, b) => compareString(a, b, "Name")}
            {...getColumnSearchProps("Name")}
            width={200}
          />
          {/* <Column
            title="Nhân viên"
            dataIndex="Employee"
            key="Employee"
            sorter={(a, b) => {
              const EmployeeA = a.Employee.toUpperCase(); // ignore upper and lowercase
              const EmployeeB = b.Employee.toUpperCase(); // ignore upper and lowercase
              if (EmployeeA < EmployeeB) {
                return -1;
              }
              if (EmployeeA > EmployeeB) {
                return 1;
              }
              return 0; // Employee must be equal
            }}
            width={200}
            {...getColumnSearchProps("Employee")}
          /> */}
          <Column
            title="Ngày tạo"
            dataIndex="CreatedAt"
            key="CreatedAt"
            render={(_, record) => {
              return dayjs(record.CreatedAt).format(Config.dateFormat);
            }}
            sorter={(a, b) => compareDatetime(a, b, "CreatedAt")}
            width={100}
          />
          <Column
            key="Action"
            width={20}
            title=""
            render={(_, record) => (
              <Space size="small">
                {/* <Tooltip title="Xem nhanh">
                  <Button type="text" icon={<EyeOutlined />} />
                </Tooltip> */}
                <EditAccount
                  form={form}
                  account={record}
                  editAccountFE={editAccount}
                />
                <DeleteAccount
                  account={record}
                  deleteAccountFE={deleteAccount}
                />
              </Space>
            )}
          />
        </Table>
      </Content>
    </Space>
  );
};

/*
const AddAccount_ = (props) => {
  const { insertAccount, form } = props;
  const [modal, contextHolder] = Modal.useModal();
  const [loading, setLoading] = useState(false);
  const showAddForm = () => {
    modal.confirm({
      title: "Thêm người dùng",
      icon: <FormOutlined />,
      closable: true,
      content: (
        <AddAccountForm
          modal={modal}
          form={form}
          setLoading={setLoading}
          insertAccount={insertAccount}
        />
      ),
      okText: "Lưu",
      okCancel: "Hủy",
      onOk(e) {
        form.submit();
      },
      onCancel() {},
      okButtonProps: { loading: loading },
      width: 600,
    });
  };
  return (
    <Space>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showAddForm()}
      >
        Thêm tài khoản
      </Button>
      {contextHolder}
    </Space>
  );
};

const AddAccountForm_ = (props) => {
  const { form, insertAccount, setLoading } = props;
  const [notify, contextHolder] = notification.useNotification();
  const insertAccountBE = async (values) => {
    var success = false;
    try {
      setLoading(true);
      var response = await AddNewUser(values);
      const { Status, ResponseData, Description } = response;
      if (Status === 1) {
        success = true;
        values.Id = ResponseData.Id;
        notify.success({
          message: "Thêm mới tài khoản thành công",
        });
        return;
      }
      notify.error({
        message: "Không thành công",
        description: Description,
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
      if (success) {
        insertAccount(values);
        setTimeout(() => {
          Modal.destroyAll();
        }, 1000);
      }
    }
  };
  return (
    <>
      {contextHolder}
      <Form
        preserve={false}
        form={form}
        layout="vertical"
        onFinish={insertAccountBE}
      >
        <Row gutter={24}>
          <Col xs={24} md={24}>
            <Form.Item
              label="Username"
              name="Username"
              required
              rules={[
                {
                  required: true,
                  message: "Username là trường bắt buộc.",
                },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item
              label="Email"
              name="EmailAddress"
              required
              rules={[
                {
                  required: true,
                  message: "Email là trường bắt buộc.",
                },
                {
                  type: "email",
                  message: "Email chưa hợp lệ.",
                },
              ]}
            >
              <Input placeholder="Nhập Email" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item
              label="Tên"
              name="Name"
              rules={[
                {
                  min: 5,
                  message: "Tên phải tối thiểu 5 ký tự",
                },
                {
                  max: 100,
                  message: "Tên chỉ được tối đa 100 ký tự",
                },
              ]}
            >
              <Input placeholder="Nhập Họ tên" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item
              label="Mật khẩu"
              name="Password"
              required
              rules={[
                {
                  min: 8,
                  message: "Mật khẩu phải tối thiểu 8 ký tự",
                },
                {
                  max: 20,
                  message: "Mật khẩu có tối đa 20 ký tự",
                },
                {
                  pattern: new RegExp(Config.passwordPattern),
                  message:
                    "Mật khẩu phải có ít nhất một số, một ký tự thường, một ký tự hoa và một ký tự đặc biệt!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item
              label="Nhắc lại mật khẩu"
              name="Confirm"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhắc lại mật khẩu của bạn",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("Password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Nhập lại mật khẩu không khớp nhau!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
          <Form.Item
            label="Vai trò"
            name="Role"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn vai trò",
              },
            ]}
          >
            <Input.Password placeholder="Nhập Họ tên" />
          </Form.Item>
        </Col>
        </Row>
      </Form>
    </>
  );
};

const EditAccount_ = (props) => {
  const { account, editAccount, form, ...other } = props;
  const [modal, contextHolder] = Modal.useModal();
  const [loading, setLoading] = useState(false);
  const showEditForm = () => {
    modal.confirm({
      title: "Chỉnh sửa người dùng",
      icon: <FormOutlined size="small" />,
      closable: true,
      content: (
        <EditAccountForm
          modal={modal}
          form={form}
          account={account}
          setLoading={setLoading}
          editAccount={editAccount}
        />
      ),
      onOk(e) {
        form.submit();
      },
      onCancel() {},
      okButtonProps: { loading: loading },
      width: 600,
    });
  };
  return (
    <Space>
      <Tooltip title="Chỉnh sửa">
        <Button type="text" icon={<EditOutlined />} onClick={showEditForm} />
      </Tooltip>
      {contextHolder}
    </Space>
  );
};

export const EditAccountForm = (props) => {
  const { form, setLoading, account, editAccount } = props;
  const [notify, contextHolder] = notification.useNotification();
  const [readonlyForm, setReadonlyForm] = useState(
    props.isReadOnly ? true : false
  );
  const modifyAccount = async (values) => {
    var success = false;
    setLoading(true);
    UpdateUser(values)
      .then((response) => {
        const { Status, ResponseData, Description } = response;
        if (Status === 1) {
          notify.success({
            message: "Đã cập nhật tài khoản " + account.Username,
          });
          account.Name = values.Name;
          account.EmailAddress = values.EmailAddress;
          editAccount(account);
          success = true;
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
      })
      .finally(() => {
        setLoading(false);
        if (success) {
          setTimeout(() => {
            Modal.destroyAll();
          }, 1000);
        }
      });
  };
  useEffect(() => {
    form.setFieldsValue({
      Username: account.Username,
      EmailAddress: account.EmailAddress,
      Name: account.Name,
    });
  }, []);
  return (
    <>
      {contextHolder}
      <Form
        preserve={false}
        form={form}
        layout="vertical"
        onFinish={modifyAccount}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Username"
              name="Username"
              required
              rules={[
                {
                  required: true,
                  message: "Username là trường bắt buộc.",
                },
                {
                  max: 20,
                  message: "Username chỉ cho phép tối đa 20 ký tự",
                },
                {
                  min: 5,
                  message: "Username cần tối thiểu 5 ký tự",
                },
              ]}
            >
              <Input placeholder="Username" readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tên"
              name="Name"
              rules={[
                {
                  min: 5,
                  message: "Tên phải tối thiểu 5 ký tự",
                },
                {
                  max: 100,
                  message: "Tên chỉ được tối đa 100 ký tự",
                },
              ]}
            >
              <Input placeholder="Nhập Họ tên" readOnly={readonlyForm} />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item
              label="Email"
              name="EmailAddress"
              required
              rules={[
                {
                  required: true,
                  message: "Email là trường bắt buộc.",
                },
                {
                  type: "email",
                  message: "Email chưa hợp lệ.",
                },
              ]}
            >
              <Input placeholder="Nhập Email" readOnly={readonlyForm} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
*/
