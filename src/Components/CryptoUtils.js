import CryptoJS from 'crypto-js';

const SECRET_KEY = '869ce142d0136334768e21425473e5ee367e0c51ce177f4900acaba3f3f11fea';

export const encryptId = (id) => {
    const encryptedId = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    return btoa(encryptedId);
};

export const decryptId = (encryptedId) => {
    const decodedEncryptedId = atob(encryptedId); 
    const bytes = CryptoJS.AES.decrypt(decodedEncryptedId, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};
