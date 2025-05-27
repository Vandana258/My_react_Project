import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080/';
// axios.defaults.baseURL = 'http://44.230.62.131:3012/';

axios.interceptors.request.use(
    async (config) => {
        const authUser = localStorage.getItem('user');
        const user = JSON.parse(authUser);
        if (user) {
            const token = user.token;
            config.headers.accessToken = token;
            if((config.url.includes('api/users/updateProfile')) || (config.url.includes('api/item/create')) || (config.url.includes('api/item/update')) || (config.url.includes('api/architects/create')) || (config.url.includes('api/architects/update')) || (config.url.includes('api/offer/uploadContractDocument')) ){ 
                config.headers= {"Content-Type": "multipart/form-data",'x-access-token': token};
            }
            else{
                config.headers= {"Content-Type": "application/json",'x-access-token': token};
            }
        }
        else{
            config.headers= {"Content-Type": "application/json"};
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response && error.response.status === 401 && error.response.data?.message === 'Unauthorized!') {
            localStorage.clear();
            window.location.href = process.env.REACT_APP_BASE_URL;
        }
        return Promise.reject(error);
    }
);