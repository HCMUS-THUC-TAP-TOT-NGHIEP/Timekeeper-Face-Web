import { Space, Typography } from "antd";
import { Footer } from "antd/es/layout/layout";
import React from "react";

function MyFooter(props) {
  return (
    <Footer style={{ textAlign: "center" }}>
      <Space direction="vertical">
        <Typography.Text type="secondary">Made by</Typography.Text>
        <Typography.Text>Nguyen Tuan Khanh and Nguyen Quoc Anh</Typography.Text>
      </Space>
    </Footer>
  );
}

export default MyFooter;
