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

// Amplify
import Amplify, { Auth } from "aws-amplify";

Amplify.configure({
    Auth: {

        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: 'ap-south-1:4d14d242-8d0d-4e7d-a0d7-01c8aa06e1e2',
        
        // REQUIRED - Amazon Cognito Region
        region: 'ap-south-1',

        // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
        // Required only if it's different from Amazon Cognito Region
        identityPoolRegion: 'ap-south-1',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'ap-south-1_ptnCibf5o',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '5j60eqnq7b8v9g6op088qccmdm',

        oauth: {
            domain: 'bibliophile-react-django.auth.ap-south-1.amazoncognito.com',
            scope: ['email', 'profile', 'openid'],
            redirectSignIn: 'https://bibliophile-react-django.herokuapp.com/home',
            redirectSignOut: 'https://bibliophile-react-django.herokuapp.com',
            responseType: 'token' // or 'token', note that REFRESH token will only be generated when the responseType is code
        }
    }
});

// You can get the current config object
const currentConfig = Auth.configure();

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
                // get_userData(user)
                
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
                <div>
        <button className = "loginBtn loginBtn--facebook" onClick = {() => {
          Auth.federatedSignIn({provider: 'Facebook'})
        }}>
            Facebook
        </button >
        <button class="loginBtn loginBtn--google" onClick = {() => {
          Auth.federatedSignIn({provider: 'Google'})
        }}>
  Google
</button>
      </div>

            </Paper>
            
        </Grid>
    )
}

export default Login;
