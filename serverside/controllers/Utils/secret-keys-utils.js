const crypto = require('crypto');
const { authenticator } = require('otplib');

const generateAccessTokenKey = () => {
    crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}

const generateRefreshTokenKey = () => {
    crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}

const generatepassWordResetKey = () => {
    crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}

const generateEmailTokenKey = () => {
    crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}
const generateSessionSecret = () => {
    crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}

const generatePasswordHashKey = () => {
    crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}

const generateOTPSecret = () => {
    const secret = authenticator.generateSecret(64);
    if(!secret){
        throw new Error("otp key generation failed");
    }
    return secret;
}

const generateOTP = async (otpSecret) => {
    const otp = authenticator.generate(otpSecret);
    if(!otp){
        throw new Error("otp token generation failed");
    }
    return otp;
}



module.exports = {generateAccessTokenKey, generateRefreshTokenKey, generateSessionSecret, generatepassWordResetKey, generateEmailTokenKey, generatePasswordHashKey, generateOTPSecret, generateOTP }