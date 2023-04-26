const otpGenerator = require('otp-generator');
const generateOTP = () => {
    const OTP = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets : false,
        specialChars: false,
        digits: true
    });
    return OTP;
};
const generatePW = () => {
    const OTP = otpGenerator.generate(10, {
        upperCaseAlphabets: true,
        lowerCaseAlphabets : true,
        specialChars: true,
        digits: true
    });
    return OTP;
};
module.exports = { generateOTP, generatePW }