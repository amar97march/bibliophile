import Axios from "axios";


const baseUrl = "https://bibliophile-react-django.herokuapp.com"
// const baseUrl = "http://127.0.0.1:8000"

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

export const getUserProfileData = (user_id) => {
  return Axios({
    method: "get",
    url: `${baseUrl}/api/users/user_profile/${user_id}/`,
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
    url: `${baseUrl}/api/books/book_info/${product_id}/`,
    headers: {
      accept: "application/json",
      Authorization: AuthStr,
    },
  });
};


export const addBookReview = (payload) => {
  return Axios({
    method: "POST",
    url: `${baseUrl}/api/books/book_reviews/`,
    data: payload,
    headers: {
      accept: "application/json",
      Authorization: AuthStr,
    },
  });
};

export const addWishlist = (payload) => {
  return Axios({
    method: "PUT",
    url: `${baseUrl}/api/books/book_wishlist/`,
    data: payload,
    headers: {
      accept: "application/json",
      Authorization: AuthStr,
    },
  });
};
export const addReadlist = (payload) => {
  return Axios({
    method: "PUT",
    url: `${baseUrl}/api/books/book_readlist/`,
    data: payload,
    headers: {
      accept: "application/json",
      Authorization: AuthStr,
    },
  });
};
export const addShelflist = (payload) => {
  return Axios({
    method: "PUT",
    url: `${baseUrl}/api/books/book_shelflist/`,
    data: payload,
    headers: {
      accept: "application/json",
      Authorization: AuthStr,
    },
  });
};


export const getHomePageData = () => {
  return Axios({
    method: "get",
    url: `${baseUrl}/api/users/home_page/`,
    headers: {
      accept: "application/json",
      Authorization: AuthStr,
    },
  });
};


export const sendFriendRequest = (payload) => {
  return Axios({
    method: "post",
    url: `${baseUrl}/api/users/friend_requests/`,
    data: payload,
    headers: {
      accept: "application/json",
      Authorization: AuthStr,
    },
  });
};

export const getFriendsData = () => {
  return Axios({
    method: "get",
    url: `${baseUrl}/api/users/friend_requests/`,
    headers: {
      accept: "application/json",
      Authorization: AuthStr,
    },
  });
};

export const updateFriendRequest = (payload) => {
  return Axios({
    method: "PUT",
    url: `${baseUrl}/api/users/friend_requests/`,
    data: payload,
    headers: {
      accept: "application/json",
      Authorization: AuthStr,
    },
  });
};