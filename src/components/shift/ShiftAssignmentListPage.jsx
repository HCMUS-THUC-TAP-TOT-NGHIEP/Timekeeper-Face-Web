import {
  DeleteOutlined,
  EditTwoTone,
  EyeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Popconfirm,
  Row,
  Space,
  Table,
  Tabs,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { compareString } from "../../utils/Comparation";
import { GetAssignmentList } from "./api";

const ShiftAssignmentListPage = (props) => {
  const { notify } = props;
  const [loading, setLoading] = useState(true);
  const [tabKey, setTabKey] = useState(0);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [shiftAssignmentList, setShiftAssignmentList] = useState([]);
  const [fullShiftAssignmentList, setFullShiftAssignmentList] = useState([]);

  // const [searchText, setSearchText] = useState("");
  // const [searchedColumn, setSearchedColumn] = useState("");
  // const searchInput = useRef(null);
  // const handleSearch = (selectedKeys, confirm, dataIndex) => {
  //   confirm();
  //   setSearchText(selectedKeys[0]);
  //   setSearchedColumn(dataIndex);
  // };
  // const handleReset = (clearFilters) => {
  //   clearFilters();
  //   setSearchText("");
  // };
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
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "Description",
      key: "Description",
      width: 200,
      sorter: (a, b) => compareString(a, b, "Description"),
    },
    {
      title: "Ca",
      dataIndex: "ShiftDescription",
      key: "ShiftDescription",
      width: 100,
      sorter: (a, b) => compareString(a, b, "ShiftDescription"),
    },
    {
      title: "Từ ngày",
      dataIndex: "StartDate",
      key: "StartDate",
      width: 100,
      sorter: (a, b) => compareString(a, b, "StartDate"),
      render: (_, { StartDate }) => dayjs(StartDate).format(Config.DateFormat),
    },
    {
      title: "Đến ngày",
      dataIndex: "EndDate",
      key: "EndDate",
      width: 100,
      sorter: (a, b) => compareString(a, b, "EndDate"),
      render: (_, { EndDate }) => dayjs(EndDate).format(Config.DateFormat),
    },
    {
      title: "Ngày tạo",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      width: 100,
      render: (_, { CreatedDate }) =>
        dayjs(CreatedDate).format(Config.DateFormat),
      sorter: (a, b) => compareString(a, b, "CreatedDate"),
    },
    {
      title: "",
      dataIndex: "",
      key: "Action",
      width: 30,
      render: (_, shiftAssignment) => (
        <ActionMenu shiftAssignment={shiftAssignment} />
      ),
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
      <Row wrap={false} align="middle">
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Bảng phân ca
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="">Quản lý ca làm việc</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="">Bảng phân ca</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space wrap>
            <Button
              type="primary"
              onClick={() => navigate("/shift/assignment")}
              icon={<PlusOutlined />}
            >
              Phân ca
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
          scroll={{
            x: 1500,
          }}
          rowSelection={{
            type: "checkbox",
            //   ...rowSelection,
          }}
          dataSource={shiftAssignmentList}
          columns={columns}
          bordered
          rowKey="Id"
        />
      </Content>
    </Space>
  );
};

const ActionMenu = (props) => {
  const { shiftAssignment } = props;
  const navigate = useNavigate();
  return (
    <Space>
      <Tooltip title="Xem nhanh">
        <Button
          onClick={() =>
            navigate(`/shift/assignment/detail/${shiftAssignment.Id}`)
          }
          type="text"
          shape="circle"
          icon={<EyeTwoTone />}
        />
      </Tooltip>
      <Tooltip title="Chỉnh sửa">
        <Button
          onClick={() =>
            navigate(`/shift/assignment/edit/${shiftAssignment.Id}`)
          }
          type="text"
          shape="circle"
          icon={<EditTwoTone />}
        />
      </Tooltip>
      <Popconfirm
        title={`Xóa phân ca`}
        description={`Bạn có chắc muốn xóa phân ca ${shiftAssignment.Description}?`}
        okText="Chắc chắn"
        cancelText="Hủy"
        okType="danger"
        placement="top"
        //   onConfirm={deleteDepartment}
      >
        <Tooltip title="Xoá">
          <Button icon={<DeleteOutlined />} type="text" shape="circle" danger />
        </Tooltip>
      </Popconfirm>
    </Space>
  );
};
export { ShiftAssignmentListPage };

