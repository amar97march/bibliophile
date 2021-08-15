import React from "react";
// import { useHistory } from 'react-router-dom';
import "../../css/signin.css";
import { Grid, Paper, Avatar, TextField, Button, Typography, Link } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { signin, saveTokenToLocalstorage } from "../../services/auth";
import { useHistory } from "react-router-dom";

const Login = ({ handleChange }) => {
    let history = useHistory();
    const paperStyle = { padding: "30px 20px", height: '580px', width: 290, margin: '0px auto' }
    const avatarStyle = { backgroundColor: "green" }
    const btstyle = { margin: "8px 0" }
    const initialValues = {
        email: "",
        password: ""
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Please enter valid email").required("Required"),
        password: Yup.string().required("Required")
    })


    const onSubmit = (values, props) => {
        console.log(values)
        const payload = values;
        signin(payload)
        .then((res) => {
          saveTokenToLocalstorage(res.data.access);
        //   setSuccess(true);
        console.log(res);
        props.resetForm()
        props.setSubmitting(false)
        history.push("/home/");
        })
        .catch((err) => {
          console.log(err);
          props.setFieldError("email", "Invalid Credentials");
          props.setSubmitting(false)
        });

        
    }


    return (

        <Grid>
            <Paper style={paperStyle}>
                <Grid align="center">
                    <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                    <h2>Sign In</h2>
                </Grid>
                <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                    {(props) => (
                        <Form>
                            <Field as={TextField} label="Email"
                                name="email"
                                placeholder="Enter email"
                                helperText={<ErrorMessage name="email" />}
                                fullWidth
                                required />
                            <Field as={TextField} label="Password" helperText={<ErrorMessage name="password" />} name="password" placeholder="Enter password" type="password" fullWidth required />

                            <Button style={btstyle} type="submit" variant="contained" disabled = {props.isSubmitting} fullWidth color="primary">{props.isSubmitting?"Loading":"Sign In"}</Button>

                            <Typography>
                                <Link href="/forget_password/" >Forgot Password</Link>

                            </Typography>
                            <Typography> Do You have an account?
                                <Link href="#" onClick={() => handleChange("event", 1)} >Sign Up</Link>

                            </Typography>

                        </Form>
                    )}
                </Formik>


            </Paper>
        </Grid>
    )
}

export default Login;
