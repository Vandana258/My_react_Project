const crypto = require('crypto');

// Generate a 256-bit (32-byte) secret key
const jwtSecretKey = crypto.randomBytes(10).toString('hex'); 
console.log("jwtSecretKey",jwtSecretKey);

const cryptoSecretKey = crypto.randomBytes(32).toString('hex'); 
console.log("cryptoSecretKey",cryptoSecretKey);
