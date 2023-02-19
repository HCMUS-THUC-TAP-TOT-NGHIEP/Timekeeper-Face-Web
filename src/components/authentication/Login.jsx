
import React, { useState, useEffect } from "react";
import { IconButton, InputAdornment, Container, Grid, Paper, TextField, Button, Typography, Link } from "@mui/material"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


const LoginPage = ({ handleChange }) => {
    useEffect(() => {
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

    const btnstyle = { margin: '8px 0' }

    const initialValues = {
        username: '',
        password: '',
        remember: false
    }
    const validationSchema = Yup.object().shape({
        username: Yup.string().email('please enter valid email').required("Required"),
        password: Yup.string().required("Required").min(4)
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
                        <h1>Log In</h1>
                    </Grid>
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        {(props) => (
                            <Form>
                                <Grid item>
                                    <Field as={TextField} label='Username' name="username"
                                        placeholder='Enter username' fullWidth required
                                        helperText={<ErrorMessage name="username" />}
                                    />
                                </Grid>
                                <Grid item rowSpacing={5}>
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
                                    <Button type='submit' color='primary' variant="contained" disabled={props.isSubmitting}
                                    style={btnstyle} fullWidth>{props.isSubmitting ? "Loading" : "Log in"}</Button>

                                </Grid>
                                
                            </Form>
                        )}
                    </Formik>
                    <Typography >
                        <Link href="/forgotpwd" >
                            Forgot password ?
                    </Link>
                    </Typography>
                    <Typography > Do you have an account ?
                        <Link href="/register" onClick={() => handleChange("event", 1)} >
                            Register
                    </Link>
                    </Typography>
                </Grid>
                </Paper>
            </Grid>
            </Container>
            
        </div>
        
    )
}

export default LoginPage