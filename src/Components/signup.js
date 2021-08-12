import React from "react";
// import { useHistory } from 'react-router-dom';
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
import { signup } from "../services/auth";

const Signup = () => {
  const paperStyle = {
    padding: "30px 20px",
    height: "580px",
    width: 290,
    margin: "0px auto",
  };
  const avatarStyle = { backgroundColor: "green" };
  const marginTop = { marginTop: 15 };

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

  const onSubmit = (values, props) => {
    const payload = {
      email: values["email"],
      password: values["password"],
      phone: values["phoneNumber"],
      first_name: values["firstName"],
      last_name: values["lastName"],
    };
    console.log(payload);
    signup(payload)
      .then((res) => {
        //   saveTokenToLocalstorage(res.data.token);
        //   setSuccess(true);
        console.log(res);
        props.resetForm();
        props.setSubmitting(false);
        alert("Register successful");
      })
      .catch((err) => {
        console.log(err.response.data);
        if ("email" in err.response.data["errors"]) {
          props.setFieldError("email", "email is already used");
        }
        if ("phone" in err.response.data["errors"]) {
          props.setFieldError("phoneNumber", "phone number is already used");
        }
        
        props.setSubmitting(false);
      });
  };

  return (
    <Grid>
      <Paper style={paperStyle}>
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
              {/* <FormControl component="fieldset" style={marginTop}>
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup aria-label="gender" name="gender1" style={{ display: "initial" }}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                    </FormControl> */}
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
              <Button type="submit" disabled = {props.isSubmitting} variant="contained" color="primary">
              {props.isSubmitting?"Signing in...":"Sign Up"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Grid>
  );
};

export default Signup;
