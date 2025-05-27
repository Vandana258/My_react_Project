import axios from "axios";
import { GENERATEPDF } from "./Endpoint";

export const generatePdf = () => {
  return axios.get(GENERATEPDF, {}, {
    responseType: 'blob', 
  });
};