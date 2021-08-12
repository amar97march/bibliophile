import Axios from "axios";


const baseUrl = "https://bibliophile-react-django.herokuapp.com"
// const baseUrl = "http://127.0.0.1:8000"

export const signin = (payload) => {
    return Axios({
      method: "POST",
      url: `${baseUrl}/api/token/`,
      data: payload,
    });
  };

export const signup = (payload) => {
  return Axios({
    method: "POST",
    url: `${baseUrl}/api/users/register/`,
    data: payload,
  });
};

export const verifyAccountOtp = (payload) => {
  return Axios({
    method: "POST",
    url: `${baseUrl}/api/users/verify_otp/`,
    data: payload,
  });
};

export const resendOtpCall = (payload) => {
  return Axios({
    method: "PATCH",
    url: `${baseUrl}/api/users/verify_otp/`,
    data: payload,
  });
};

export const forgetPassword = (payload) => {
  return Axios({
    method: "PATCH",
    url: `${baseUrl}/api/users/reset_password_otp/`,
    data: payload,
  });
};

export const verifyEmailAPI = (payload) => {
  return Axios({
    method: "POST",
    url: `${baseUrl}/api/users/email_verification/`,
    data: payload,
  });
};


export const SearchBook = (keyword, page) => {
  return Axios({
    method: "get",
    url: `https://www.googleapis.com/books/v1/volumes?q=intitle:${keyword}&startIndex=${(page-1)*10}`
  });
};