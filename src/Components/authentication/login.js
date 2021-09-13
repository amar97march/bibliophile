import React from "react";
// import { useHistory } from 'react-router-dom';
import "../../css/signin.css";
import { Grid, Paper, Avatar, TextField, Button, Typography, Link } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { saveTokenToLocalstorage, updateProfileData } from "../../services/auth";
import { useHistory } from "react-router-dom";
import UserPool from "../../services/UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";

const Login = ({ handleChange }) => {
    let history = useHistory();
    // const paperStyle = { padding: "30px 20px", height: '580px', width: 290, margin: '0px auto' }
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


    const get_userData = async (user)=>{
        await user.getUserData(function(err, userData) {
            if (err) {
                console.log(err.message || JSON.stringify(err));
                return;
            }
            var data = {}
            console.log('User data for user ' + userData["UserAttributes"]);
            userData["UserAttributes"].forEach(function (arrayItem){
                data[arrayItem["Name"]] = arrayItem["Value"]
            })

            const formValues = {
                first_name: data["given_name"],
                last_name: data["family_name"],
                phone: data["phone_number"],
                email: data["email"],
                // description: "",
            }
            
            updateProfileData(formValues)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                
            });

        },
        { bypassCache: true })
            
        

    }

    const onSubmit = async (values, props) => {
        const user = new CognitoUser({
            Username: values["email"],
            Pool: UserPool
        });

        const authDetails = new AuthenticationDetails({
            Username:values["email"],
            Password:values["password"]
        });
        user.authenticateUser(authDetails,{

            onSuccess: data => {
                console.log("onSucess:", data);
                saveTokenToLocalstorage(data["accessToken"]["jwtToken"]);
                props.resetForm()
                props.setSubmitting(false)
                get_userData(user)
                
                history.push("/home/");
            },
            onFailure: err => {
                console.log("onFailure:", err);
                
                props.setFieldError("email", err["message"]);
                if (err["message"]=== "User is not confirmed."){
                    var userData = {
                        Username: values["email"],
                        Pool: UserPool,
                      };
                      
                      var cognitoUser = new CognitoUser(userData);
                      cognitoUser.resendConfirmationCode(function(err, result) {
                  
                      })
                    setTimeout(() => {
                        history.push("/verify_email_otp/", { email: values["email"] });
                      }, 2000);
                }
                props.setSubmitting(false)
            },
            newPasswordRequired: data => {
                console.log("newPasswordRequired", data);
                props.setFieldError("email", "Invalid Credentials");
                props.setSubmitting(false)
            }
        })

        
    }


    return (

        <Grid>
            <Paper className = "login-section">
                <Grid align="center">
                    <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                    <h2>Sign In</h2>
                </Grid>
                <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema} validateOnChange={false}
   validateOnBlur={false}>
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
