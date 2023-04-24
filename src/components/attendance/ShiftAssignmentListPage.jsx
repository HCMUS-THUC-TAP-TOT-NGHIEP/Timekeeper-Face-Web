import {
  DeleteFilled,
  EditFilled,
  EyeOutlined,
  FilterFilled,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Input,
  Popconfirm,
  Row, Space,
  Table,
  Tabs,
  theme
} from "antd";
import { Content } from "antd/es/layout/layout";
import useNotification from "antd/es/notification/useNotification";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { compareString } from "../../utils";
import { GetAssignmentList } from "./api";

const ShiftAssignmentListPage = (props) => {
  const [loading, setLoading] = useState(true);
  const [tabKey, setTabKey] = useState(0);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [shiftAssignmentList, setShiftAssignmentList] = useState([]);
  const [fullShiftAssignmentList, setFullShiftAssignmentList] = useState([]);
  const [notify, contextHolder] = useNotification();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
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
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "Description",
      key: "Description",
      width: 80,
      sorter: (a, b) => compareString(a, b, "Description"),
      ...getColumnSearchProps("Description"),
    },
    {
      title: "Kiểu phân ca",
      dataIndex: "ShiftDescription",
      key: "ShiftDescription",
      width: 80,
      sorter: (a, b) => compareString(a, b, "ShiftDescription"),
      ...getColumnSearchProps("ShiftDescription"),
    },
    {
      title: "Từ ngày",
      dataIndex: "StartDate",
      key: "StartDate",
      width: 60,
      // render: (_, { StartDate }) => dayjs(StartDate).format(Config.dateFormat),
      sorter: (a, b) => compareString(a, b, "StartDate"),
      ...getColumnSearchProps("StartDate"),
    },
    {
      title: "Đến ngày",
      dataIndex: "EndDate",
      key: "EndDate",
      width: 60,
      render: (_, { EndDate }) => dayjs(EndDate).format(Config.DateFormat),
      sorter: (a, b) => compareString(a, b, "EndDate"),
      ...getColumnSearchProps("EndDate"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      width: 60,
      render: (_, { CreatedDate }) =>
        dayjs(CreatedDate).format(Config.DateFormat),
      sorter: (a, b) => compareString(a, b, "CreatedDate"),
      ...getColumnSearchProps("CreatedDate"),
    },
    {
      title: "",
      dataIndex: "",
      key: "Action",
      width: 10,
      render: (_, shiftAssignment) => (
        <ActionMenu shiftAssignment={shiftAssignment} />
      ),
      fixed: "right",
    },
  ];

  useEffect(() => {
    document.title = "Bảng phân ca";
    GetAssignmentList()
      .then((response) => {
        const { Status, ResponseData, Description } = response;
        if (Status === 1) {
          setFullShiftAssignmentList(ResponseData);
          setShiftAssignmentList(ResponseData);
          return;
        }
        notify.error({
          message: "Có lỗi",
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
      .finally((done) => {
        setLoading(false);
      });
  }, []);
  const changeTabs = (activeKey) => {
    setTabKey(activeKey);
    if (activeKey == 0) {
      setShiftAssignmentList(fullShiftAssignmentList);
    } else {
      setShiftAssignmentList(
        fullShiftAssignmentList.filter((a) => a.AssignType == activeKey)
      );
    }
  };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="">Quản lý ca làm việc</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="">Bảng phân ca</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space wrap>
            <Button
              type="primary"
              onClick={() => navigate("/shift/assignment")}
              icon={<PlusOutlined />}
            >
              Tạo phân ca làm việc mới
            </Button>
          </Space>
        </Col>
      </Row>
      <Tabs
        activeKey={tabKey}
        items={[
          {
            key: 0,
            label: "Tất cả",
          },
          {
            key: 1,
            label: "Phân ca theo phòng ban",
          },
          {
            key: 2,
            label: "Phân ca cho cá nhân",
          },
        ]}
        onChange={changeTabs}
      />
      <Content style={{ background: colorBgContainer }}>
        <Table
          loading={loading}
          style={{}}
          scroll={{
            x: 1500,
          }}
          rowSelection={{
            type: "checkbox",
            //   ...rowSelection,
          }}
          dataSource={shiftAssignmentList}
          columns={columns}
        />
      </Content>
      {contextHolder}
    </Space>
  );
};

const ActionMenu = (props) => {
  const { shiftAssignment } = props;
  const items = [
    {
      label: (
        <Space>
          <Link to={`/shift/assignment/detail/${shiftAssignment.Id}`}>
            <EyeOutlined /> Xem nhanh
          </Link>
        </Space>
      ),
      key: "0",
    },

    {
      label: (
        <Space>
          <Link to={`/shift/assignment/edit/${shiftAssignment.Id}`}>
            <EditFilled />
            Chỉnh sửa
          </Link>
        </Space>
      ),
      key: "1",
    },
    {
      label: (
        <Popconfirm
          //   title={`Xóa phòng ban ID ${department.Id}`}
          //   description={`Bạn có chắc muốn xóa nhân viên ID ${department.Id} - ${department.Name}?`}
          okText="Yes"
          okType="danger"
          cancelText="No"
          placement="top"
          //   onConfirm={deleteDepartment}
        >
          <a href="#" style={{ display: "block" }}>
            <Space>
              <DeleteFilled key="1" />
              Xóa
            </Space>
          </a>
        </Popconfirm>
      ),
      key: "2",
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
      arrow
    >
      <Space>
        <MoreOutlined />
      </Space>
    </Dropdown>
  );
};
export { ShiftAssignmentListPage };

