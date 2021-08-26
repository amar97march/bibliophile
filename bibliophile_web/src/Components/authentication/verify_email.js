import React, { useEffect, useState } from "react";
import "../../css/signin.css";
import {
  Grid,
  Paper,
  Avatar,
  Button,
  Typography,
} from "@material-ui/core";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { verifyEmailAPI } from "../../services/auth";

const VerifyEmail = (props) => {

  const email = props.match.params.email;
  const email_token = props.match.params.email_token;
  const [emailStatus, setEmailStatus] = useState("")
  const [displayButton, setDisplayButton] = useState({"display":"none"})


  // const paperStyle = {
  //   padding: "30px 20px",
  //   height: "580px",
  //   width: 290,
  //   margin: "0px auto",
  // };
  const avatarStyle = { backgroundColor: "green" };
  const marginTop = { marginTop: 50 };

  const onLoad = (values, props) => {
    const payload = {
      email: email,
      email_token: email_token,
    };
    console.log(payload);
    verifyEmailAPI(payload)
      .then((res) => {
        setEmailStatus("Your account has been verified. You will be redirected in 5 seconds. Thank You")
        
      })
      .catch((err) => {
        setEmailStatus("Your account has not been. Please check your confirmation url. Thank You")
        setDisplayButton({})
      });
  };

  useEffect(
    onLoad
    ,[])

  return (
    <Grid>
      <Paper className = "login-section">
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlinedIcon />
          </Avatar>
          <h2>Verify Account</h2>
          <Typography variant="h6">
            Email verification status
          </Typography>
        </Grid>

        <Typography style = {{marginTop}}>
          {emailStatus}<br/>Please login again <Button style = {displayButton} color="primary">click here</Button>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default VerifyEmail;
