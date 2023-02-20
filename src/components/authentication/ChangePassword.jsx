
import React, { useState, useEffect } from "react";
import { IconButton, InputAdornment, Container, Grid, Paper, TextField, Button, Typography, Link } from "@mui/material"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const ChangePasswordPage = ({ handleChange }) => {
    useEffect(() => {
        document.title = `Change Password Page`;
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

    const btnstyle = { margin: '8px 0' }
    const passwordRegExp=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/

    const initialValues = {
        email: '',
        password: '',
        newPassword: '',
        confirmNewPassword:'',
        remember: false
    }
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('please enter valid email').required("Required"),
        password: Yup.string().min(8, "Minimum characters should be 8")
        .matches(passwordRegExp,"Password must have one upper, lower case, number").required('Required'),
        newPassword: Yup.string().min(8, "Minimum characters should be 8")
        .matches(passwordRegExp,"Password must have one upper, lower case, number").required('Required'),
        confirmNewPassword:Yup.string().oneOf([Yup.ref('newPassword')],"Password not matches").required('Required')
    })
    const onSubmit = (values, props) => {
        console.log(values)
        setTimeout(() => {
            props.resetForm()
            props.setSubmitting(false)
        }, 2000)

    }
    return (
        <div>
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
                    <Grid align='center'>
                        <h1>Change Password</h1>
                    </Grid>
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        {(props) => (
                            <Form>
                                <Grid item>
                                    <Field as={TextField} label='Email' name="email"
                                        placeholder='Enter email' fullWidth required
                                        helperText={<ErrorMessage name="email" />}
                                    />
                                </Grid>
                                <Grid item>
                                    <Field as={TextField} 
                                    label='Password' 
                                    name="password"
                                    placeholder='Enter password' 
                                    type={values.showPass ? "text" : "password"} 
                                    fullWidth 
                                    required
                                    helperText={<ErrorMessage name="password" />} 
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handlePassVisibilty}
                                                    aria-label="toggle password"
                                                    edge="end"
                                                >
                                                    {values.showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    />
                                </Grid>

                                <Grid item>
                                    <Field as={TextField} 
                                    label='New password' 
                                    name="newPassword"
                                    placeholder='Enter new password' 
                                    type={values.showPass ? "text" : "password"} 
                                    fullWidth 
                                    required
                                    helperText={<ErrorMessage name="newPassword" />} 
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handlePassVisibilty}
                                                    aria-label="toggle password"
                                                    edge="end"
                                                >
                                                    {values.showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    />
                                </Grid>

                                <Grid item>
                                    <Field as={TextField} 
                                    label='Confirm new password' 
                                    name="confirmNewPassword"
                                    placeholder='Enter confirm new password' 
                                    type={values.showPass ? "text" : "password"} 
                                    fullWidth 
                                    required
                                    helperText={<ErrorMessage name="confirmNewPassword" />} 
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handlePassVisibilty}
                                                    aria-label="toggle password"
                                                    edge="end"
                                                >
                                                    {values.showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button type='submit' color='primary' variant="contained" disabled={props.isSubmitting}
                                    style={btnstyle} fullWidth>{props.isSubmitting ? "Loading" : "Change password"}</Button>

                                </Grid>
                                
                            </Form>
                        )}
                    </Formik>
                    <Typography >
                        <Link href="/forgotpwd" >
                            Forgot password ?
                    </Link>
                    </Typography>
                </Grid>
                </Paper>
            </Grid>
            </Container>
            
        </div>
        
    )
}

export default ChangePasswordPage;