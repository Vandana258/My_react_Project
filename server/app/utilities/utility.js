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

Utility.showStringToFirstCharacterInUpperCase = async (string) => {
    return string.replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

Utility.generateAlphanumericCode = async (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};


Utility.GenerateRandomPassword = (length) => {
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specialCharacters = "!@#$%&*-_";
    
    // Ensure that the password contains at least one character from each category
    const passwordArray = [
        lowerCase[Math.floor(Math.random() * lowerCase.length)],
        upperCase[Math.floor(Math.random() * upperCase.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        specialCharacters[Math.floor(Math.random() * specialCharacters.length)],
    ];

    // Fill the rest of the password length with random characters
    const allCharacters = lowerCase + upperCase + numbers + specialCharacters;
    for (let i = passwordArray.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        passwordArray.push(allCharacters[randomIndex]);
    }

    // Shuffle the password array to randomize the order
    const shuffledPassword = passwordArray.sort(() => Math.random() - 0.5).join('');
    
    return shuffledPassword;
};



module.exports = Utility;
