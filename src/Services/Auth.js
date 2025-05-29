import axios from "axios";
import { FORGOTPASSWORD, LOGIN, SECRET, SETUP2FA, SIGNUP } from "./Endpoint";

export const login = (values) => {
   return axios.post(LOGIN, values);
}

export const signup = (values) => {
   return axios.post(SIGNUP, values);
}

export const secret = (data) =>{
   return axios.post(SECRET,data);
}

export const setup2FA = (data) =>{
   return axios.post(SETUP2FA,data);
}

export const forgotpassword = (data) =>{
   return axios.post(FORGOTPASSWORD,data);
}