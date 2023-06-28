import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Row,
  Space,
  Table,
  Typography,
  notification,
} from "antd";
import Search from "antd/es/input/Search";
import { Content } from "antd/es/layout/layout";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Config from "../../constant";
import { compareDatetime, compareString } from "../../utils/Comparation";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { AddAccount } from "./AddAccount";
import { DeleteAccount } from "./DeleteAccount";
import { EditAccount } from "./EditAccount";
import { GetAccountList } from "./api";
import { useAuthState } from "../../Contexts/AuthContext";

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
  const [reloading, setReloading] = useState(true);
  const searchInputRef = useRef();
  const { authorization } = useAuthState();
  const UserPermission = authorization.User;

  useEffect(() => {
    if (!UserPermission || !UserPermission.read) return;
    async function loadData() {
      try {
        let searchString = searchInputRef.current
          ? searchInputRef.current.input.value
          : "";
        setLoading(true);
        var response = await GetAccountList({
          Page: currentPage,
          PerPage: pageSize,
          SearchString: searchString,
        });
        const { Status, ResponseData, Description } = response;
        if (Status === 1) {
          const { AccountList, Total } = ResponseData;
          for (var ob of AccountList) {
            ob.key = ob.Id;
          }
          setAccountList(AccountList);
          setTotal(Total);
          return;
        }
        notify.error({
          message: "Không thành công",
          description: Description,
        });
      } catch (error) {
        handleErrorOfRequest({ notify, error });
      } finally {
        setLoading(false);
      }
    }
    loadData();
    console.log("UserPermission", UserPermission);
  }, [currentPage, pageSize, notify, reloading, authorization]);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  // const getColumnSearchProps = (dataIndex) => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //     close,
  //   }) => (
  //     <div
  //       style={{
  //         padding: 8,
  //       }}
  //       onKeyDown={(e) => e.stopPropagation()}
  //     >
  //       <Input
  //         ref={searchInput}
  //         value={selectedKeys[0]}
  //         onChange={(e) =>
  //           setSelectedKeys(e.target.value ? [e.target.value] : [])
  //         }
  //         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //         style={{
  //           marginBottom: 8,
  //           display: "block",
  //         }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size="small"
  //         >
  //           Tìm kiếm
  //         </Button>
  //         <Button
  //           onClick={() => clearFilters && handleReset(clearFilters)}
  //           size="small"
  //           style={{
  //             width: 90,
  //           }}
  //         >
  //           Đặt lại
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered) => (
  //     <FilterFilled
  //       style={{
  //         color: filtered ? "#1890ff" : undefined,
  //       }}
  //     />
  //   ),
  //   onFilter: (value, record) =>
  //     record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  //   onFilterDropdownOpenChange: (visible) => {
  //     if (visible) {
  //       setTimeout(
  //         () => (searchInput.current ? searchInput.current.input : undefined),
  //         100
  //       );
  //     }
  //   },
  //   render: (text) =>
  //     searchedColumn === dataIndex ? (
  //       <Highlighter
  //         highlightStyle={{
  //           backgroundColor: "#ffc069",
  //           padding: 0,
  //         }}
  //         searchWords={[searchText]}
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ""}
  //       />
  //     ) : (
  //       text
  //     ),
  // });
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
      <Row wrap={false} gutter={[16, 16]} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Danh mục người dùng
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <NavLink to="/manage/account">Danh mục người dùng</NavLink>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          {UserPermission && UserPermission.create ? (
            <AddAccount insertFE={insertAccount} />
          ) : (
            <></>
          )}
        </Col>
      </Row>
      {UserPermission ? (
        UserPermission.read ? (
          <Content style={{ paddingTop: 10 }}>
            <Row
              wrap={true}
              gutter={[16, 16]}
              align="middle"
              style={{ marginBottom: 16 }}
            >
              <Col flex="none" style={{ width: 400 }}>
                <Search
                  allowClear
                  ref={searchInputRef}
                  onSearch={(value) => {
                    setReloading(!reloading);
                  }}
                  enterButton
                  placeholder="Tìm kiếm bằng username, email"
                ></Search>
              </Col>
              <Col flex="auto" style={{ textAlign: "right" }}>
                <Space wrap>
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
                    Tải lại
                  </Button>
                </Space>
              </Col>
            </Row>
            <Table
              className="boxShadow0"
              loading={loading}
              bordered
              scroll={{ y: 700 }}
              dataSource={accountList}
              width={1000}
              pagination={{
                position: ["bottomRight"],
                pageSize: pageSize,
                total: total,
                current: currentPage,
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                },
                showTotal: (total) => `Tổng ${total} bản ghi.`,
                showSizeChanger: true,
                pageSizeOptions: [10, 15, 20],
              }}
            >
              <Column
                title="Username"
                dataIndex="Username"
                key="Username"
                sorter={(a, b) => compareString(a, b, "Username")}
                // {...getColumnSearchProps("Username")}
                width={100}
              />
              <Column
                title="Email"
                dataIndex="EmailAddress"
                key="EmailAddress"
                sorter={(a, b) => compareString(a, b, "EmailAddress")}
                // {...getColumnSearchProps("EmailAddress")}
                width={300}
              />
              <Column
                title="Tên"
                dataIndex="Name"
                key="Name"
                sorter={(a, b) => compareString(a, b, "Name")}
                // {...getColumnSearchProps("Name")}
                width={200}
              />
              <Column
                title="Phân quyền"
                dataIndex="RoleText"
                key="Role"
                sorter={(a, b) => compareString(a, b, "RoleText")}
                width={160}
              />

              <Column
                title="Ngày tạo"
                dataIndex="CreatedAt"
                key="CreatedAt"
                render={(_, record) => {
                  return dayjs(record.CreatedAt).format(Config.DateFormat);
                }}
                sorter={(a, b) => compareDatetime(a, b, "CreatedAt")}
                width={120}
                align="center"
              />
              <Column
                align="center"
                key="Action"
                width={80}
                title=""
                render={(_, record) => (
                  <Space size="small">
                    {UserPermission.update ? (
                      <EditAccount
                        form={form}
                        account={record}
                        editAccountFE={editAccount}
                      />
                    ) : (
                      <></>
                    )}
                    {UserPermission.delete ? (
                      <DeleteAccount
                        account={record}
                        deleteAccountFE={deleteAccount}
                      />
                    ) : (
                      <></>
                    )}
                  </Space>
                )}
                fixed="right"
              />
            </Table>
          </Content>
        ) : (
          <Typography.Title level={4}>
            Tài khoản không được phép truy cập đến mục này.
          </Typography.Title>
        )
      ) : (
        <></>
      )}
    </Space>
  );
};
