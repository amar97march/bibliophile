import Axios from "axios";


const baseUrl = "http://127.0.0.1:8000"

export const signin = (payload) => {
    return Axios({
      method: "POST",
      url: `${baseUrl}/api/token/`,
      data: payload,
    });
  };