import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { notification } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { RegisterAccount } from "./api";

const RegisterPage = ({ handleChange }) => {
  const navigate = useNavigate();
  const [notify, contextHolder] = notification.useNotification();
  const [values, setValues] = useState({
    showPass: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    document.title = `Register Page`;
  }, []);

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
    confirmPassword: "",
    firstName: "",
    familyName: "",
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    firstName: Yup.string().required("First name is required"),
    familyName: Yup.string().required("Family name is required"),
  });
  const onSubmit = (values, props) => {
    console.log(values);
    var requestData = {
      email: values.email,
      firstName: values.firstName,
      familyName: values.familyName,
      password: values.password,
    };
    RegisterAccount(requestData)
      .then((response) => {
        var { Status, Description } = response;
        if (Status !== 1) {
          notify.error({
            message: "Register account failed",
            description: Description,
          });
          setIsSubmitting(false);
          return;
        }
        navigate("/login");
      })
      .catch((error) => {
        notify.error({
          message: "Register account failed",
          description: error,
        });
        console.log(error);
      });
  };

  return (
    <div style={{ backgroundColor: "#EEEEEE" }}>
      {contextHolder}
      <Container maxWidth="sm">
        <Grid
          container
          spacing={1}
          direction="column"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Paper elelvation={2} sx={{ padding: 5 }}>
            <Grid container direction="column" spacing={1}>
              <Grid align="center">
                <h1>Register</h1>
              </Grid>
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
              >
                {(props) => (
                  <Form>
                    <Grid container columnSpacing={3} p={1}>
                      <Grid item>
                        <Field
                          as={TextField}
                          label="First name *"
                          name="firstName"
                          placeholder="Enter first name"
                          fullWidth
                          helperText={
                            <ErrorMessage
                              name="firstName"
                              render={(msg) => (
                                <div style={{ color: "red" }}>{msg}</div>
                              )}
                            />
                          }
                        />
                      </Grid>
                      <Grid item>
                        <Field
                          as={TextField}
                          label="Family name *"
                          name="familyName"
                          placeholder="Enter family name"
                          fullWidth
                          helperText={
                            <ErrorMessage
                              name="familyName"
                              render={(msg) => (
                                <div style={{ color: "red" }}>{msg}</div>
                              )}
                            />
                          }
                        />
                      </Grid>
                    </Grid>

                    <Grid item p={1}>
                      <Field
                        as={TextField}
                        label="Email *"
                        name="email"
                        placeholder="Enter email"
                        fullWidth
                        helperText={
                          <ErrorMessage
                            name="email"
                            render={(msg) => (
                              <div style={{ color: "red" }}>{msg}</div>
                            )}
                          />
                        }
                      />
                    </Grid>
                    <Grid item p={1}>
                      <Field
                        as={TextField}
                        label="Password"
                        name="password"
                        placeholder="Enter password"
                        type={values.showPass ? "text" : "password"}
                        fullWidth
                        required
                        helperText={
                          <ErrorMessage
                            name="password"
                            render={(msg) => (
                              <div style={{ color: "red" }}>{msg}</div>
                            )}
                          />
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handlePassVisibilty}
                                aria-label="toggle password"
                                edge="end"
                              >
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

                    <Grid item p={1}>
                      <Field
                        as={TextField}
                        label="Confirm password"
                        name="confirmPassword"
                        placeholder="Enter confirm password"
                        type={values.showPass ? "text" : "password"}
                        fullWidth
                        required
                        helperText={
                          <ErrorMessage
                            name="confirmPassword"
                            render={(msg) => (
                              <div style={{ color: "red" }}>{msg}</div>
                            )}
                          />
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handlePassVisibilty}
                                aria-label="toggle password"
                                edge="end"
                              >
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

                    <Grid item p={1}>
                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={isSubmitting}
                        style={btnstyle}
                        fullWidth
                      >
                        {isSubmitting ? "Loading" : "Register"}
                      </Button>
                    </Grid>
                  </Form>
                )}
              </Formik>

              <Grid item p={1}>
                <Typography variant="body2" color="textSecondary" component="p">
                  Do you have an account ? <Link href="/login">Login</Link>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Container>
    </div>
  );
};

export default RegisterPage;
