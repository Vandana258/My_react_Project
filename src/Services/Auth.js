import axios from "axios";
import { LOGIN, SECRET, SETUP2FA } from "./Endpoint";

export const login = (values) => {
   return axios.post(LOGIN, values);
}

export const secret = (data) =>{
   return axios.post(SECRET,data);
}

export const setup2FA = (data) =>{
   return axios.post(SETUP2FA,data);
}