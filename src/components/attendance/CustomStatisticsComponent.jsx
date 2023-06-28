import { Button, Card, Modal, Space, Statistic, Table } from "antd";
import { useState } from "react";
import CountUp from "react-countup";
const formatter = (value) => <CountUp end={value} separator="," />;
let defaultCols = [
  {
    key: "index",
    title: "Stt",
    width: 60,
    align: "right",
    render: (_, __, index) => index + 1,
  },
  {
    key: "code",
    dataIndex: "Id",
    title: "Mã NV",
    width: 80,
    sorter: (a, b) => a.Id > b.Id,
  },
  {
    key: "name",
    title: "Nhân viên",
    dataIndex: "EmployeeName",
    width: 200,
  },
  {
    key: "department",
    title: "Phòng ban",
    dataIndex: "Department",
    width: 200,
  },
];

const CustomStatisticsComponent = ({
  cols,
  dataSrc,
  title,
  total,
  modalTitle,
  icon,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };
  //   const { children } = rest;
  return (
    <>
      <Card bordered={false} size="small" onClick={showModal}>
        <Statistic
          valueStyle={{
            fontSize: "14px",
            display: "flex",
            justifyContent: "space-between",
          }}
          value={total}
          prefix={
            <Space>
              {icon}
              {title}
            </Space>
          }
          formatter={formatter}
        />
      </Card>
      <Modal
        title={modalTitle}
        onOk={hideModal}
        onCancel={hideModal}
        footer={[
          <Button type="primary" onClick={hideModal}>
            Đóng
          </Button>,
        ]}
        open={open}
        width={900}
      >
        <Table
          className="boxShadow0 rounded"
          rootClassName=""
          columns={[...defaultCols, ...cols]}
          dataSource={dataSrc || []}
          rowKey="Id"
          scroll={{
            y: 800,
          }}
          pagination={{
            total: (dataSrc || []).length,
            defaultCurrent: 1,
            pageSize: 15,
            pageSizeOptions: [15, 25, 50],
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bản ghi.`,
          }}
        ></Table>
      </Modal>
    </>
  );
};

export { CustomStatisticsComponent };
