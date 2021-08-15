import Axios from "axios";


// const baseUrl = "https://bibliophile-react-django.herokuapp.com"
const baseUrl = "http://127.0.0.1:8000"

let authToken = localStorage.getItem("bibliophile_token");
let AuthStr = `Bearer ${authToken}`;

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

export const saveTokenToLocalstorage = (token) => {
  localStorage.setItem("bibliophile_token", token);
};

export const getProfileData = () => {
  return Axios({
    method: "get",
    url: `${baseUrl}/api/users/profile/`,
    headers: {
      accept: "application/json",
      Authorization: AuthStr,
    },
  });
};


export const updateProfileData = (payload) => {
  return Axios({
    method: "put",
    url: `${baseUrl}/api/users/profile/`,
    data: payload,
    headers: {
      accept: "application/json",
      Authorization: AuthStr,
    },
  });
};

export const getBookInfo = (product_id) => {
  return Axios({
    method: "get",
    url: `https://www.googleapis.com/books/v1/volumes/${product_id}/`
  });
};

export const getBookReviews = (product_id) => {
  return Axios({
    method: "get",
    url: `${baseUrl}/api/users/profile/${product_id}/`,
    headers: {
      accept: "application/json",
      Authorization: AuthStr,
    },
  });
};
