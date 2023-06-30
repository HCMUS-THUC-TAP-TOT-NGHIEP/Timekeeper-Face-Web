import { DeleteOutlined } from "@ant-design/icons";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Col,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { AddDepartmentFrom } from "./AddPage";
import { EditDepartmentForm } from "./EditPage";
import { DeleteOneDepartment, GetDepartmentList } from "./api";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import Config from "../../constant";
import { compareString } from "../../utils/Comparation";

const DepartmentList = (props) => {
  const { notify } = props;
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(true);
  const [currentDepartmentList, setCurrentDepartmentList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const searchInputRef = useRef();

  useEffect(() => {
    setLoading(true);
    let searchString = searchInputRef.current
      ? searchInputRef.current.input.value
      : "";
    GetDepartmentList({
      Page: page,
      PerPage: perPage,
      SearchString: searchString,
    })
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          const { DepartmentList, Total } = ResponseData;
          setTotal(Total);
          setCurrentDepartmentList(DepartmentList);
          return;
        }
        notification.error({
          message: "Không thành công",
          description: Description,
        });
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [perPage, page, reloading]);

  const updateOneDepartment = (values) => {
    const newCurrentDepartmentList = currentDepartmentList.map((department) => {
      if (department.Id === values.Id) {
        return values;
      } else {
        return department;
      }
    });
    setCurrentDepartmentList(newCurrentDepartmentList);
    return;
  };
  const insertOneDepartment = (values) => {
    setCurrentDepartmentList([...currentDepartmentList, values]);
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "Id",
      key: "Id",
      width: 80,
      sorter: (a, b) => a.Id - b.Id,
      align: "right",
    },
    {
      title: "Phòng ban/ Bộ phận",
      dataIndex: "Name",
      key: "Name",
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      title: "Trưởng phòng",
      dataIndex: "Manager",
      key: "Manager",
      render: (_, { ManagerName }) => ManagerName,
      sorter: (a, b) => compareString(a.ManagerName, b.ManagerName),
      with: 200,
    },
    {
      title: "Số nhân viên",
      dataIndex: "EmployeeTotal",
      key: "EmployeeTotal",
      sorter: (a, b) => a.EmployeeTotal - b.EmployeeTotal,
      width: 150,
      align: "right",
    },
    {
      title: "Ngày tạo",
      dataIndex: "CreatedAt",
      key: "CreatedAt",
      render: (value) =>
        dayjs(value).locale("vi").format(Config.TimestampFormat),
      with: 50,
      sorter: (a, b) =>
        dayjs(a.CreatedAt).locale("vi").toDate() -
        dayjs(b.CreatedAt).locale("vi").toDate(),
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_, department) => (
        <ActionMenu
          department={department}
          setDepartmentList={setCurrentDepartmentList}
          departmentList={currentDepartmentList}
          updateOneDepartment={updateOneDepartment}
        />
      ),
      fixed: "right",
      align: "center",
      width: 100,
    },
  ];
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row wrap={false} align="middle" gutter={[16, 16]}>
        <Col flex="none">
          <Space direction="vertical">
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              Danh sách phòng ban
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/department/all">Phòng ban</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space wrap align="center">
            <AddDepartmentFrom
              listState={[insertOneDepartment, currentDepartmentList]}
            />
          </Space>
        </Col>
      </Row>
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
              placeholder="Tìm kiếm bằng mã, tên phòng ban"
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
          className="boxShadow0 rounded"
          loading={loading}
          bordered
          rowKey="Id"
          scroll={{
            x: 900,
          }}
          dataSource={currentDepartmentList}
          columns={columns}
          pagination={{
            pageSize: perPage,
            current: page,
            total: total,
            pageSizeOptions: [10, 20, 50],
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setPage(page);
              setPerPage(pageSize);
            },
            showTotal: (total) => "Tổng " + total + " bản ghi.",
          }}
        />
      </Content>
    </Space>
  );
};

function ActionMenu(props) {
  const { department, setDepartmentList, departmentList, updateOneDepartment } =
    props;
  const [notify, contextHolder] = notification.useNotification();

  const deleteDepartment = () => {
    DeleteOneDepartment({ Id: department.Id })
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status === 1) {
          notify.success({
            description: `Đã xóa phòng ban ${department.Id} - ${department.Name}`,
          });
          setDepartmentList(
            departmentList.filter((a) => a.Id !== department.Id)
          );
          return;
        }
        notify.error({
          message: "Không thành công",
          description: Description,
        });
      })
      .catch((error) => {
        handleErrorOfRequest({ notify, error });
      });
  };

  return (
    <Space wrap size="small">
      <EditDepartmentForm
        content={department}
        listState={[updateOneDepartment, departmentList]}
      />
      <Popconfirm
        title={`Xóa phòng ban ID ${department.Id}`}
        description={`Bạn có chắc muốn xóa nhân viên ID ${department.Id} - ${department.Name}?`}
        okText="Yes"
        okType="danger"
        cancelText="No"
        placement="top"
        onConfirm={deleteDepartment}
      >
        <Tooltip title="Xoá" placement="bottom">
          <Button
            size="small"
            icon={<DeleteOutlined />}
            danger
            type="text"
            shape="circle"
          />
        </Tooltip>
      </Popconfirm>

      {contextHolder}
    </Space>
  );
}

export { DepartmentList };
