import React from "react";
// import { useHistory } from 'react-router-dom';
import "../../css/signin.css";
import { useHistory } from "react-router-dom";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormHelperText } from "@material-ui/core";
import UserPool from "../../services/UserPool";
import Amplify, { Auth } from "aws-amplify";




const Signup = () => {

  const avatarStyle = { backgroundColor: "green" };

  let history = useHistory();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    termsAndConditions: false,
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(3, "Too short").required("Required"),
    lastName: Yup.string().min(3, "Too short"),
    email: Yup.string().email("Please enter valid email").required("Required"),
    phoneNumber: Yup.number()
      .typeError("Enter valid phone number")
      .required("Required"),
    password: Yup.string()
      .min(8, "Password  minimum length should be 8")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password not matched")
      .required("Required"),
    termsAndConditions: Yup.string().oneOf(
      ["true"],
      "Accept terms & conditions"
    ),
  });

  const onSubmit = async (values, props) => {
    try {
      const { user } = await Auth.signUp({
          username: values["email"],
          password: values["password"],
          attributes: {
              email: values["email"],  
              given_name: values["firstName"],
              family_name: values["lastName"],
              phone_number: values["phoneNumber"]
          }
      });
      console.log(user);
      history.push("/verify_email_otp/", { email: values["email"] });
  } catch (error) {
      props.setFieldError("email", error["message"]);
  }
  };

  return (
    <Grid>
      <Paper className="login-section">
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlinedIcon />
          </Avatar>
          <h2>Sign Up</h2>
          <Typography variant="caption">
            Please fill this form to create an account
          </Typography>
        </Grid>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(props) => (
            <Form>
              <Field
                as={TextField}
                name="firstName"
                helperText={<ErrorMessage name="firstName" />}
                fullWidth
                label="First Name"
                placeholder="Enter your first name"
              />
              <Field
                as={TextField}
                name="lastName"
                helperText={<ErrorMessage name="lastName" />}
                fullWidth
                label="Last Name"
                placeholder="Enter your last name"
              />
              <Field
                as={TextField}
                name="email"
                helperText={<ErrorMessage name="email" />}
                fullWidth
                label="Email"
                placeholder="Enter your email"
              />
              <Field
                as={TextField}
                name="phoneNumber"
                helperText={<ErrorMessage name="phoneNumber" />}
                fullWidth
                label="Phone Number"
                placeholder="Enter your phone number"
              />
              <Field
                as={TextField}
                name="password"
                helperText={<ErrorMessage name="password" />}
                fullWidth
                label="Password"
                type="password"
                placeholder="Enter your password"
              />
              <Field
                as={TextField}
                name="confirmPassword"
                helperText={<ErrorMessage name="confirmPassword" />}
                fullWidth
                label="Confirm Password"
                type="password"
                placeholder="Enter your password again"
              />
              <FormControlLabel
                control={<Field as={Checkbox} name="termsAndConditions" />}
                label="I accept the terms and conditions"
              />
              <FormHelperText>
                {" "}
                <ErrorMessage name="termsAndConditions" />{" "}
              </FormHelperText>
              <Button
                className="signup-btn"
                type="submit"
                disabled={props.isSubmitting}
                variant="contained"
                color="primary"
              >
                {props.isSubmitting ? "Signing in..." : "Sign Up"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
      
    </Grid>
  );
};

export default Signup;
