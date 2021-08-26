import { React } from "react";
import { Switch, Route } from "react-router-dom";
import "../css/signin.css";
import LoginRegisterContainer from "./login_register";
import VerifyEmailOtp from "../Components/authentication/verify_email_otp";
import VerifyEmail from "../Components/authentication/verify_email";
import ResetPassword from "../Components/authentication/forgot_password";

const LoginSection = () => {
  return (
    <div className="SigninOutcontainer">
      <h1>Bibliophile</h1>
      <Switch>
        <Route path="/forget_password/" component={ResetPassword} exact />
        <Route path="/verify_email_otp/" component={VerifyEmailOtp} exact />
        <Route path="/verify_email/:email/:email_token/" exact component={(props) => <VerifyEmail {...props}/>}/>
        <Route path="/" component={LoginRegisterContainer} exact />

        {/* <Route component = {RouterUrl}/> */}
      </Switch>
    </div>
  );
};

export default LoginSection;
