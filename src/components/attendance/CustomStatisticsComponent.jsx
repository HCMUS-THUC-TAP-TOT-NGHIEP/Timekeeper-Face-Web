import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Modal, Space, Statistic, Table } from "antd";
import { useState } from "react";
import CountUp from "react-countup"; 
const formatter = (value) => <CountUp end={value} separator="," />;

const CustomStatisticsComponent = ({
  cols,
  dataSrc,
  title,
  total,
  modalTitle,
  icon,
  ...rest
}) => 
{
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
              {/* <FontAwesomeIcon icon={faCalendarDays} /> */}
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
        open={open}
      >
        <Table columns={cols} dataSource={dataSrc} rowKey="Id"></Table>
      </Modal>
    </>
  );
}

export { CustomStatisticsComponent };
