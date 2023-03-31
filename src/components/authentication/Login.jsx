import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { Button, notification } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { LoginAccount } from "./api";

const LoginPage = (props) => {
  const handleChange = props.handleChange;
  const navigate = useNavigate();
  const [notify, contextHolder] = notification.useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      navigate("/dashboard");
    }
    document.title = `Login Page`;
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
    LoginAccount(requestData)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status !== 1) {
          notify.error({
            message: "Login account failed",
            description: Description,
          });
          console.log(Description);
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
      {contextHolder}
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
    </>
  );
};

export default LoginPage;
