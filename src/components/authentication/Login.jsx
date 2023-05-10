import { Button, Col, Form, Input, Layout, Row, Typography, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../../Contexts/AuthContext";
import { LoginAccount2 } from "./api";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import {
//   Container,
//   Grid,
//   IconButton,
//   InputAdornment,
//   Link,
//   Paper,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { Button, Col, Layout, Row, notification } from "antd";
// import { ErrorMessage, Field, Form, Formik } from "formik";
// import { useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import { LoginAccount, LoginAccount2 } from "./api";
// import { useAuthDispatch, useAuthState } from "../../Contexts/AuthContext";
// import { Title } from "@mui/icons-material";
// import { Content } from "antd/es/layout/layout";

/*
const LoginPage = (props) => {
  const { handleChange, notify } = props;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  useEffect(() => {
    if (userDetails.token) {
      navigate("/dashboard");
    }
    document.title = `Đăng nhập`;
  }, []);
  const [values, setValues] = useState({
    showPass: false,
  });

  const handlePassVisibilty = () => {
    setValues({
      ...values,
      showPass: !values.showPass,
    });
  };

  const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Vui lòng nhập username hoặc email."),
    password: Yup.string()
      .min(8, "Mật khẩu tối thiểu 8 ký tự.")
      .required("Vui lòng nhập mật khẩu."),
  });
  const onSubmit = (values) => {
    setLoading(true);
    var requestData = {
      email: values.email,
      password: values.password,
    };
    LoginAccount2(dispatch, values)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status !== 1) {
          notify.error({
            message: "Đăng nhập thất bại",
            description: Description,
          });
          setIsSubmitting(false);
          return;
        }
        localStorage.setItem("access_token", ResponseData.access_token);
        navigate("/dashboard"); // redirect to home page
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
  };

  return (
    <>
      <div style={{ backgroundColor: "#EEEEEE" }}>
        <Container maxWidth="sm">
          <Grid
            container
            spacing={5}
            direction="column"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            <Paper elelvation={2} sx={{ padding: 5 }}>
              <Grid container direction="column" spacing={1}>
                <Grid align="center">
                  <h1>Log In</h1>
                </Grid>
                <Formik
                  initialValues={initialValues}
                  onSubmit={onSubmit}
                  validationSchema={validationSchema}
                >
                  {(props) => (
                    <Form>
                      <div>
                        <Grid item p={1}>
                          <Field
                            as={TextField}
                            label="Username hoặc email"
                            name="email"
                            placeholder="Nhập username hoặc email"
                            fullWidth
                            helperText={
                              <ErrorMessage
                                name="email"
                                render={(msg) => (
                                  <span style={{ color: "red" }}>{msg}</span>
                                )}
                              />
                            }
                          />
                        </Grid>
                      </div>

                    <div>
                      <Grid item p={1}>
                        <Field
                          as={TextField}
                          label="Password"
                          name="password"
                          placeholder="Enter password"
                          fullWidth
                          helperText={
                            <ErrorMessage
                              name="password"
                              render={(msg) => (
                                <span style={{ color: "red" }}>{msg}</span>
                              )}
                            />
                          }
                          type={values.showPass ? "text" : "password"}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handlePassVisibilty}>
                                  {values.showPass ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </div>

                    <Grid item p={1}>
                      <Button
                        htmlType="submit"
                        type="primary"
                        variant="contained"
                        size="large"
                        loading={loading}
                        style={{ width: "100%" }}
                      >
                        Log In
                      </Button>
                    </Grid>
                  </Form>
                )}
              </Formik>
              <Grid item p={1}>
                <Typography>
                  <Link href="/forgotpwd">Forgot password ?</Link>
                </Typography>
                <Typography>
                  {" "}
                  Do you have an account ?
                  <Link
                    href="/register"
                    onClick={() => handleChange("event", 1)}
                  >
                    Register
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Container>
    </div>
  );
};
*/

const LoginPage = (props) => {
  const { notify } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useAuthDispatch();
  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);
  const onSubmit = (values) => {
    setLoading(true);
    LoginAccount2(dispatch, values)
      .then((response) => {
        const { Status, Description } = response;
        if (Status !== 1) {
          notify.error({
            message: "Đăng nhập không thành công",
            description: Description,
          });
          return;
        }
        navigate("/"); // redirect to home page
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
  };
  return (
    <Layout
      style={{
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <Row
        style={{
          height: "inherit",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Col xs={2} sm={6} xl={8} />
        <Col xs={20} sm={12} xl={8}>
          <Typography.Title level={1} style={{ textAlign: "center" }}>
            Đăng nhập
          </Typography.Title>
          <Content
            style={{
              background: colorBgContainer,
              margin: "auto",
              padding: 40,
            }}
          >
            <Form
              onFinish={onSubmit}
              autoComplete="off"
              layout="vertical"
              style={{ background: colorBgContainer }}
            >
              <Form.Item
                label="Username hoặc email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập username hoặc email của bạn!",
                  },
                ]}
                hasFeedback
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu của bạn!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  size="large"
                  loading={loading}
                >
                  Đăng nhập
                </Button>
                <Typography.Link>
                  <Link to="/forgotpwd">Quên mật khẩu?</Link>
                </Typography.Link>
              </Form.Item>
              {/* <Typography.Text>
                Chưa có tài khoản?<Link href="/register">Register</Link>
              </Typography.Text> */}
            </Form>
          </Content>
        </Col>
        <Col xs={2} sm={6} xl={8} />
      </Row>
    </Layout>
  );
};

export default LoginPage;
