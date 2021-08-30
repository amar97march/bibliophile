import React, { useState } from "react";
import "../../css/signin.css";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { forgetPassword, resendOtpCall } from "../../services/auth";
import { useHistory } from "react-router-dom";
import { CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "../../services/UserPool";

const ResetPassword = () => {
  let history = useHistory();
  const [email, setEmail] = useState("")
  const [showResetSection, setShowResetSection] = useState({"display":"none"})
  const avatarStyle = { backgroundColor: "green" };
  const marginTop = { marginTop: 50 };

  const initialValues = {
    email: "",
    password: ""
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Please enter valid email").required("Required")
})

const validationSchemaReset = Yup.object().shape({
    
  otp: Yup.string()
    .min(4, "OTP  minimum length should be 4")
    .required("Required"),
    password: Yup.string()
      .min(8, "Password  minimum length should be 8")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password not matched")
      .required("Required"),
});

  const onSubmit = (values, props) => {
    // const payload = {
    //   email: email,
    //   newPassword: values["password"],
    //   otp: values["otp"],
    // };
    var userData = {
      Username: email,
      Pool: UserPool,
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmPassword(values["otp"], values["password"], {
			onSuccess() {
				alert('Password confirmed!');
			},
			onFailure(err) {
				alert('Password not confirmed!');
			},
		});
    // console.log(payload);
    // forgetPassword(payload)
    //   .then((res) => {
    //     console.log(res);

    //     props.setSubmitting(false);
    //     setTimeout(() => {
    //       history.push("/");
    //     }, 1000);
    //   })
    //   .catch((err) => {
    //     props.setFieldError("otp", "Otp is invalid");

    //     props.setSubmitting(false);
    //   });
  };
  const resendOtp = (values, props) => {
    const payload = {
      email: values["email"]
    };
    console.log(payload);
    
    var userData = {
      Username: values["email"],
      Pool: UserPool,
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.forgotPassword({
      onSuccess: function(data) {
        // successfully initiated reset password request
        setShowResetSection({})
        setEmail(values["email"])
        props.setSubmitting(false);
      },
      onFailure: function(err) {
        props.setFieldError("email",err.message)
        props.setSubmitting(false);
      }
  
    });
    
  };

  return (
    <Grid>
      <Paper className = "login-section" >
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlinedIcon />
          </Avatar>
          <h2>Reset Password</h2>
          <Typography variant="caption">
            {/* Please enter OTP sent to {location.state.email} */}
          </Typography>
        </Grid>
        <Formik
          initialValues={initialValues}
          onSubmit={resendOtp}
          validationSchema={validationSchema}
        >
          {(props) => (
            <Form>
            <Field as={TextField} label="Email"
                name="email"
                placeholder="Enter email"
                helperText={<ErrorMessage name="email" />}
                fullWidth
                required />

            <Button type="submit" variant="contained" disabled = {props.isSubmitting} fullWidth color="primary">{props.isSubmitting?"Loading":"Get Otp"}</Button>

        </Form>
          )}
        </Formik>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchemaReset}
        >
          {(props) => (
            
            <Form style={{...marginTop, ...showResetSection}}>
              <Typography variant="caption">
            Please enter OTP sent to {email}
          </Typography>
              <Field
                as={TextField}
                name="otp"
                helperText={<ErrorMessage name="otp" />}
                fullWidth
                label="OTP"
                placeholder="Enter OTP received"
              />
            <Field as={TextField} label="Password" helperText={<ErrorMessage name="password" />} name="password" placeholder="Enter password" type="password" fullWidth required />
            <Field
                as={TextField}
                name="confirmPassword"
                helperText={<ErrorMessage name="confirmPassword" />}
                fullWidth
                label="Confirm Password"
                type="password"
                placeholder="Enter your password again"
              />
            <Button type="submit" variant="contained" disabled = {props.isSubmitting} fullWidth color="primary">{props.isSubmitting?"Updating":"Update"}</Button>

        </Form>
          )}
        </Formik>
      </Paper>
    </Grid>
  );
};

export default ResetPassword;
