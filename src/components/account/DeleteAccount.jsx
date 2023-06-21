import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tooltip, notification } from "antd";
import React, { useState } from "react";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { DeleteUser } from "./api";

const DeleteAccount = (props) => {
  const { account, deleteAccountFE } = props;
  const [loading, setLoading] = useState(false);
  const [notify, contextHolder] = notification.useNotification();

  const deleteAccountBE = async () => {
    try {
      setLoading(true);
      var response = await DeleteUser({ Username: account.Username });
      const { Status, Description } = response;
      if (Status === 1) {
        notify.success({
          message: "Đã xóa tài khoản " + account.Username,
        });
        deleteAccountFE(account);
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
  };

  return (
    <>
      <Popconfirm
        title="Xóa người dùng"
        description={`Chắc chắn loại bỏ người dùng ${account.Username}?`}
        onConfirm={deleteAccountBE}
        okText="Xóa"
        okButtonProps={{ danger: true, loading: loading }}
        cancelText="Hủy"
        placement="topRight"
      >
        <Tooltip title="Xóa" trigger="hover">
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Tooltip>
      </Popconfirm>
      {contextHolder}
    </>
  );
};
export { DeleteAccount };

