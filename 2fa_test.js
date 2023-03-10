const speakeasy = require('speakeasy')

const generateOtp = function generateOtp() {
    let token = speakeasy.totp({
        secret: process.env.OTP_KEY,
        encoding: 'base32',
        digits: 6,
        step: 60,
        window: 11
    });
    console.log(token);
}

const verifyOtp = function verifyOtp(token){
    let expiry =  speakeasy.totp.verifyDelta({
        secret:process.env.OTP_KEY,
        encoding: 'base32',
        token: token,
        step: 60,
        window: 11
    });
    console.log(expiry)
}
/* generateOtp() */
verifyOtp(743794)