import axios from "axios";
import { ADDITEM, FINDALLITEM, FINDONEITEM, UPDATEITEM } from "./Endpoint";

export const createItem = (values) => {
   return axios.post(ADDITEM, values);
}

export const findallItem = () => {
   return axios.get(FINDALLITEM);
}

export const findoneItem = (params) => {
  return axios.get(FINDONEITEM, { params }); 
};

export const updateItem = (values) => {
   return axios.put(UPDATEITEM, values);
}