const db = require("../models");
const Utility = function(utility) {  
};


Utility.isPasswordValid = (password) => {
    const minLength = 8;
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    return (
        password.length >= minLength &&
        lowercaseRegex.test(password) &&
        uppercaseRegex.test(password) &&
        numberRegex.test(password) &&
        specialCharRegex.test(password)
    );
};


module.exports = Utility;
