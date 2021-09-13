import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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
import verified_pic from "../../Assets/verified.png";
import { useHistory } from "react-router-dom";
import UserPool from "../../services/UserPool";
import { CognitoUser } from "amazon-cognito-identity-js";

const VerifyEmailOtp = () => {
  const location = useLocation();
  const [isVerified, setIsVerfied] = useState(false)
  let history = useHistory();

  const avatarStyle = { backgroundColor: "green" };
  const marginTop = { marginTop: 50 };

  const initialValues = {
    otp: "",
  };

  const validationSchema = Yup.object().shape({
    
    otp: Yup.string()
      .min(4, "OTP  minimum length should be 4")
      .required("Required"),
  });

  const onSubmit = (values, props) => {
    
    var userData = {
      Username: location.state.email,
      Pool: UserPool,
    };
    
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(values["otp"], true, function(err, result) {
      if (err) {
        console.log(err.message || JSON.stringify(err));
        props.setFieldError("otp", "Otp is invalid");
        props.setSubmitting(false);
        return;
      }
      props.setSubmitting(false);
      console.log('otp call result: ' + result);
      setIsVerfied(true)
      setTimeout(() => {
              history.push("/");
            }, 5000);
          

    });
  };


  const resendOtp = (values, props) => {
    var userData = {
      Username: location.state.email,
      Pool: UserPool,
    };
    
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.resendConfirmationCode(function(err, result) {
      if (err) {
        props.setFieldError("otp", "Error resending OTP");
        return;
      }
      
      console.log("Otp Resend")

    })
  };

  return (
    <Grid>
      <Paper className = "login-section">
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlinedIcon />
          </Avatar>
          <h2>Verify Account</h2>
          <div style = {{display: isVerified? "block":"none"}}>
            <img src = {verified_pic} style = {{maxWidth: "120px"}} alt="abc"/>
          </div>
          <Typography style = {{display: isVerified? "none":"block"}} variant="caption">
            Please enter OTP sent to {location.state.email}
          </Typography>
        </Grid>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          style = {{display: isVerified? "none":"block"}}
        >
          {(props) => (
            <Form align="center" style={{...marginTop, display: isVerified? "none":"block"}}>
              <Field
                as={TextField}
                name="otp"
                helperText={<ErrorMessage name="otp" />}
                fullWidth
                label="OTP"
                placeholder="Enter OTP received"
              />
              <Button
                type="submit"
                disabled={props.isSubmitting}
                variant="outlined"
                color="primary"
                style = {{display: isVerified? "none":"block"}}
              >
                {props.isSubmitting ? "Verifying..." : "Verify"}
              </Button>
            </Form>
          )}
        </Formik>

        <Typography  style = {{display: isVerified? "none":"block"}}>
          If OTP is not recieved? <br/>To resend <Button color="primary" onClick = {resendOtp}>click here</Button>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default VerifyEmailOtp;
