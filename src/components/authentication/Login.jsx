import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import {
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { notification, Spin } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { LoginAccount } from "./api";

const LoginPage = ({ handleChange }) => {
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

  const btnstyle = { margin: "8px 0" };
  const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("please enter valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Minimum characters should be 8")
      .matches(
        passwordRegExp,
        "Password must have one upper, lower case, number"
      )
      .required("Password is required"),
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
            message: "Request có lỗi.",
            description: `Data: [${error.response.data}], Status [${error.response.status}]`,
          });
        } else if (error.request) {
          notify.error({
            message: "Response có lỗi.",
            description: error.response,
          });
        } else {
          notify.error({
            description: error.message,
          });
        }
      })
      .finally((done) => {
        setLoading(false);
      });
  };

  return (
    <div style={{ backgroundColor: "#EEEEEE" }}>
      {contextHolder}
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
                          label="Email"
                          name="email"
                          placeholder="Enter email"
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
                      <LoadingButton
                        type="submit"
                        color="primary"
                        variant="contained"
                        loadingPosition="start"
                        style={btnstyle}
                        fullWidth
                        loading={loading}
                      >
                        {isSubmitting ? "Loading" : "Log in"}
                      </LoadingButton>
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

export default LoginPage;
