import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Config from "../../constant";
import { changePasswordBE } from "./api";

// const ChangePasswordPage_ = ({ handleChange }) => {
//   useEffect(() => {
//     document.title = `Đổi mật khẩu`;
//   }, []);
//   const [values, setValues] = useState({
//     showPass: false,
//   });
//   const handlePassVisibilty = () => {
//     setValues({
//       ...values,
//       showPass: !values.showPass,
//     });
//   };
//   const btnstyle = { margin: "8px 0" };
//   const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

//   const initialValues = {
//     email: "",
//     password: "",
//     newPassword: "",
//     confirmNewPassword: "",
//   };
//   const validationSchema = Yup.object().shape({
//     email: Yup.string()
//       .email("please enter valid email")
//       .required("Email is required"),
//     password: Yup.string()
//       .min(8, "Minimum characters should be 8")
//       .matches(
//         passwordRegExp,
//         "Password must have one upper, lower case, number"
//       )
//       .required("Password is required"),
//     newPassword: Yup.string()
//       .min(8, "Minimum characters should be 8")
//       .matches(
//         passwordRegExp,
//         "Password must have one upper, lower case, number"
//       )
//       .required("New password is required"),
//     confirmNewPassword: Yup.string()
//       .oneOf([Yup.ref("newPassword")], "Password not matches")
//       .required("Confirm new password is required"),
//   });
//   const onSubmit = (values, props) => {
//     axios
//       .post("http://localhost:3000/changepwd", {
//         email: values.email,
//         password: values.password,
//       })
//       .then((response) => {
//         localStorage.setItem("access_token", response.data.token);
//       })
//       .catch((error) => {
//         alert(error);
//       });
//   };
//   return (
//     <div style={{ backgroundColor: "#EEEEEE" }}>
//       <Container maxWidth="sm">
//         <Grid
//           container
//           spacing={1}
//           direction="column"
//           justifyContent="center"
//           style={{ minHeight: "100vh" }}
//         >
//           <Paper elelvation={2} sx={{ padding: 5 }}>
//             <Grid container direction="column" spacing={1}>
//               <Grid align="center">
//                 <h1>Change Password</h1>
//               </Grid>
//               <Formik
//                 initialValues={initialValues}
//                 onSubmit={onSubmit}
//                 validationSchema={validationSchema}
//               >
//                 {(props) => (
//                   <Form>
//                     <Grid item p={1}>
//                       <Field
//                         as={TextField}
//                         label="Email"
//                         name="email"
//                         placeholder="Enter email"
//                         fullWidth
//                         required
//                         helperText={
//                           <ErrorMessage
//                             name="email"
//                             render={(msg) => (
//                               <div style={{ color: "red" }}>{msg}</div>
//                             )}
//                           />
//                         }
//                       />
//                     </Grid>
//                     <Grid item p={1}>
//                       <Field
//                         as={TextField}
//                         label="Password"
//                         name="password"
//                         placeholder="Enter password"
//                         type={values.showPass ? "text" : "password"}
//                         fullWidth
//                         required
//                         helperText={
//                           <ErrorMessage
//                             name="password"
//                             render={(msg) => (
//                               <div style={{ color: "red" }}>{msg}</div>
//                             )}
//                           />
//                         }
//                         InputProps={{
//                           endAdornment: (
//                             <InputAdornment position="end">
//                               <IconButton
//                                 onClick={handlePassVisibilty}
//                                 aria-label="toggle password"
//                                 edge="end"
//                               >
//                                 {values.showPass ? (
//                                   <VisibilityOffIcon />
//                                 ) : (
//                                   <VisibilityIcon />
//                                 )}
//                               </IconButton>
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>

//                     <Grid item p={1}>
//                       <Field
//                         as={TextField}
//                         label="New password"
//                         name="newPassword"
//                         placeholder="Enter new password"
//                         type={values.showPass ? "text" : "password"}
//                         fullWidth
//                         required
//                         helperText={
//                           <ErrorMessage
//                             name="newPassword"
//                             render={(msg) => (
//                               <div style={{ color: "red" }}>{msg}</div>
//                             )}
//                           />
//                         }
//                         InputProps={{
//                           endAdornment: (
//                             <InputAdornment position="end">
//                               <IconButton
//                                 onClick={handlePassVisibilty}
//                                 aria-label="toggle password"
//                                 edge="end"
//                               >
//                                 {values.showPass ? (
//                                   <VisibilityOffIcon />
//                                 ) : (
//                                   <VisibilityIcon />
//                                 )}
//                               </IconButton>
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>

//                     <Grid item p={1}>
//                       <Field
//                         as={TextField}
//                         label="Confirm new password"
//                         name="confirmNewPassword"
//                         placeholder="Enter confirm new password"
//                         type={values.showPass ? "text" : "password"}
//                         fullWidth
//                         required
//                         helperText={
//                           <ErrorMessage
//                             name="confirmNewPassword"
//                             render={(msg) => (
//                               <div style={{ color: "red" }}>{msg}</div>
//                             )}
//                           />
//                         }
//                         InputProps={{
//                           endAdornment: (
//                             <InputAdornment position="end">
//                               <IconButton
//                                 onClick={handlePassVisibilty}
//                                 aria-label="toggle password"
//                                 edge="end"
//                               >
//                                 {values.showPass ? (
//                                   <VisibilityOffIcon />
//                                 ) : (
//                                   <VisibilityIcon />
//                                 )}
//                               </IconButton>
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>
//                     <Grid item p={1}>
//                       <Button
//                         type="submit"
//                         color="primary"
//                         variant="contained"
//                         disabled={props.isSubmitting}
//                         style={btnstyle}
//                         fullWidth
//                       >
//                         {props.isSubmitting ? "Loading" : "Change password"}
//                       </Button>
//                     </Grid>
//                   </Form>
//                 )}
//               </Formik>
//               <Grid item p={1}>
//                 <Typography>
//                   <Link href="/forgotpwd">Forgot password ?</Link>
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Grid>
//       </Container>
//     </div>
//   );
// };

const ChangePasswordPage = (props) => {
  var [notify, contextHolder] = notification.useNotification();
  const [loadingButton, setLoadingButton] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Đổi mật khẩu";
  }, []);
  const changePassword = async (values) => {
    try {
      setLoadingButton(true);
      const { Status, Description } = await changePasswordBE(values);
      if (Status === 1) {
        notify.success({
          message: "Bạn vừa đổi mật khẩu thành công",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
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
      setLoadingButton(false);
    }
  };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {contextHolder}
      <Row wrap={false}>
        <Col flex="none">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/manage/account">Profile</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="">Đổi mật khẩu</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Form layout="vertical" onFinish={changePassword}>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Nhập mật khẩu hiện tại"
              name="Password"
              required
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu hiện tại",
                },
              ]}
              hasFeedback
            >
              <Input.Password size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Mật khẩu mới"
              name="NewPassword"
              required
              dependencies={["Password"]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu mới",
                },
                {
                  min: 8,
                  message: "Mật khẩu tối thiểu 8 ký tự",
                },
                {
                  pattern: new RegExp(Config.passwordPattern),
                  message:
                    "Mật khẩu phải có ít nhất một số, một ký tự thường, một ký tự hoa và một ký tự đặc biệt!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("Password") !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Vui lòng nhập mật khẩu mới khác với mật khẩu cũ!"
                      )
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Nhập lại mật khẩu mới"
              name="Confirm"
              required
              dependencies={["NewPassword"]}
              rules={[
                {
                  max: 100,
                  message: "Tên chỉ được tối đa 100 ký tự",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("NewPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Nhập lại mật khẩu không khớp nhau!")
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item>
            <Space direction="horizontal">
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                size="large"
                loading={loadingButton}
              >
                Lưu
              </Button>
              <Button size="large" onClick={() => navigate(-1)}>
                Quay lại
              </Button>
            </Space>
          </Form.Item>
        </Row>
      </Form>
    </Space>
  );
};

export { ChangePasswordPage };
