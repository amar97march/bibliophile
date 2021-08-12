import React from "react";
import { useLocation } from "react-router-dom";
import "../css/signin.css";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Formik, Form, Field, ErrorMessage, setError } from "formik";
import * as Yup from "yup";
import { FormHelperText } from "@material-ui/core";
import { verifyAccountOtp, resendOtpCall } from "../services/auth";

const VerifyEmailOtp = () => {
  const location = useLocation();
  const paperStyle = {
    padding: "30px 20px",
    height: "580px",
    width: 290,
    margin: "0px auto",
  };
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
    const payload = {
      email: location.state.email,
      otp: values["otp"],
    };
    console.log(payload);
    verifyAccountOtp(payload)
      .then((res) => {
        console.log(res);

        props.setSubmitting(false);
        alert("Account verified");
      })
      .catch((err) => {
        props.setFieldError("otp", "Otp is invalid");

        props.setSubmitting(false);
      });
  };
  const resendOtp = (values, props) => {
    const payload = {
      email: location.state.email
    };
    console.log(payload);
    resendOtpCall(payload)
      .then((res) => {
        console.log(res);
        alert("Otp send successfully");
      })
      .catch((err) => {
          alert(err.response.data.error);
      });
  };

  return (
    <Grid>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlinedIcon />
          </Avatar>
          <h2>Verify Account</h2>
          <Typography variant="caption">
            Please enter OTP sent to {location.state.email}
          </Typography>
        </Grid>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {(props) => (
            <Form align="center" style={marginTop}>
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
              >
                {props.isSubmitting ? "Verifying..." : "Verify"}
              </Button>
            </Form>
          )}
        </Formik>

        <Typography>
          If OTP is not recieved? <br/>To resend <Button color="primary" onClick = {resendOtp}>click here</Button>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default VerifyEmailOtp;
