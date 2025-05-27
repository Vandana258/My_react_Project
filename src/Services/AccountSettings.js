import axios from "axios";
import { CHANGEPASSWORD, CHECKCURRENTPASSWORD, UPDATEPROFILE } from "./Endpoint";

export const updateProfile = (values) => {
   return axios.post(UPDATEPROFILE, values);
}

export const changePassword = (values) => {
   return axios.post(CHANGEPASSWORD, values);
}

export const checkCurrentPassword = (values) => {
   return axios.post(CHECKCURRENTPASSWORD, values);
}