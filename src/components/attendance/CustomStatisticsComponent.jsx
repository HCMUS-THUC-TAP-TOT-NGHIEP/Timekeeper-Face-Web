import { Button, Card, Modal, Space, Statistic, Table } from "antd";
import { useState } from "react";
import CountUp from "react-countup";
import { defaultColumns } from "../employee";
const formatter = (value) => <CountUp end={value} separator="," />;

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
          columns={cols}
          dataSource={dataSrc | []}
          rowKey="Id"
          scroll={{
            x: 1500,
            y: 1200,
          }}
          pagination={{
            total: (dataSrc || []).length,
            defaultCurrent: 1,
            pageSize: 15,
            pageSizeOptions: [15, 25, 50],
            showSizeChanger: true,
          }}
        ></Table>
      </Modal>
    </>
  );
};

export { CustomStatisticsComponent };
