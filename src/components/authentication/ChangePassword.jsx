
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Button, Container, Grid, IconButton, InputAdornment, Link, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from "react";
import * as Yup from 'yup';

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
        confirmNewPassword:''
        }
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('please enter valid email').required("Email is required"),
        password: Yup.string().min(8, "Minimum characters should be 8")
        .matches(passwordRegExp,"Password must have one upper, lower case, number").required('Password is required'),
        newPassword: Yup.string().min(8, "Minimum characters should be 8")
        .matches(passwordRegExp,"Password must have one upper, lower case, number").required('New password is required'),
        confirmNewPassword:Yup.string().oneOf([Yup.ref('newPassword')],"Password not matches").required('Confirm new password is required')
    })
    const onSubmit = (values, props) => {
        console.log(values)
        axios
            .post('http://localhost:3000/changepwd', {
                email: values.email,
                password: values.password,
            })
            .then((response) => {
                localStorage.setItem("token", response.data.token);
            })
            .catch((error) => { alert(error); });
            
    }
    return (
        <div style={{backgroundColor: '#EEEEEE'}}>
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
                                <Grid item p={1}>
                                    <Field as={TextField} label='Email' name="email"
                                        placeholder='Enter email' fullWidth required
                                        helperText={<ErrorMessage name="email" render={msg => <div style={{color: 'red'}}>{msg}</div>} />}
                                    />
                                </Grid>
                                <Grid item p={1}>
                                    <Field as={TextField} 
                                    label='Password' 
                                    name="password"
                                    placeholder='Enter password' 
                                    type={values.showPass ? "text" : "password"} 
                                    fullWidth 
                                    required
                                    helperText={<ErrorMessage name="password" render={msg => <div style={{color: 'red'}}>{msg}</div>} />} 
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

                                <Grid item p={1}>
                                    <Field as={TextField} 
                                    label='New password' 
                                    name="newPassword"
                                    placeholder='Enter new password' 
                                    type={values.showPass ? "text" : "password"} 
                                    fullWidth 
                                    required
                                    helperText={<ErrorMessage name="newPassword" render={msg => <div style={{color: 'red'}}>{msg}</div>} />} 
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

                                <Grid item p={1}>
                                    <Field as={TextField} 
                                    label='Confirm new password' 
                                    name="confirmNewPassword"
                                    placeholder='Enter confirm new password' 
                                    type={values.showPass ? "text" : "password"} 
                                    fullWidth 
                                    required
                                    helperText={<ErrorMessage name="confirmNewPassword" render={msg => <div style={{color: 'red'}}>{msg}</div>} />} 
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
                                <Grid item p={1}>
                                    <Button type='submit' color='primary' variant="contained" disabled={props.isSubmitting}
                                    style={btnstyle} fullWidth>{props.isSubmitting ? "Loading" : "Change password"}</Button>

                                </Grid>
                                
                            </Form>
                        )}
                    </Formik>
                    <Grid item p={1}>
                        <Typography >
                            <Link href="/forgotpwd" >
                                Forgot password ?
                        </Link>
                        </Typography>
                    </Grid>
                    
                </Grid>
                </Paper>
            </Grid>
            </Container>
            
        </div>
        
    )
}

export default ChangePasswordPage;