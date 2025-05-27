
const AUTH = "/api/auth";
export const LOGIN = AUTH + "/login";
export const SECRET = AUTH + "/verify2FA";
export const SETUP2FA = AUTH + "/setup2FA";

// Account Settings
const ACCOUNTSETTINGS = 'api/users';
export const UPDATEPROFILE = ACCOUNTSETTINGS + '/updateProfile';
export const CHANGEPASSWORD = ACCOUNTSETTINGS + '/changepassword';
export const CHECKCURRENTPASSWORD = ACCOUNTSETTINGS + '/checkvalidatepassword';

//Dashbaord
const DASHBOARD = 'api/dashboard';
export const GENERATEPDF = DASHBOARD + '/generate-pdf';

//Item
const ITEM = 'api/item';
export const ADDITEM = ITEM + '/create'; 
export const FINDALLITEM = ITEM + '/findall'; 
export const FINDONEITEM = ITEM + '/findone'; 
export const UPDATEITEM = ITEM + '/update'; 
export const UPDATESTATUS = ITEM + '/status-change'; 