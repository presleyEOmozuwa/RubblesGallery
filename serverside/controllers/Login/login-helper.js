const { signAccessToken, signRefreshToken, signRefreshTokenPlus, saveRefreshToken } = require('../Utils/token.utils');
const { sendOTPtoUser } = require('../Utils/email-utils');
const LocationTracker = require('../Models/location-tracker-model');
const speakeasy = require('speakeasy');

const sessionIdMatch = async (user, sessionId) => {
    const loc = await LocationTracker.findOne({
        userId: user.userId,
        locationId: sessionId
    })
    return loc;
}

const createOTPsecret = async (user) => {
    const secret = speakeasy.generateSecret({ length: 64 });
    user.set({
        otpsecret: secret.base32
    })
    const updateduser = await user.save();
    return updateduser;
}

const createOTPcode = (secret) => {
    const otpCode = speakeasy.totp({
        secret: secret,
        encoding: 'base32'
    });
    
    if(!otpCode){
        throw new Error("otp token generation failed")
    }
    
    return otpCode;
}

const otpValidator = async (secret, code) => {
    const isValid = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: code,
        window: 2,
        step: 60
    });
}


const loginChecker = async (user, useToken, rememberMe, sessionId, res, otp) => {
    const loc = await sessionIdMatch(user, sessionId);

    if (useToken || (useToken && rememberMe)) {
        await sendOTPtoUser(user, otp);
        res.send({ "status": "otp sent to user", userId: user._id });
    }
    else if (rememberMe && loc) {
        const renewToken = signRefreshTokenPlus(user)
        await saveRefreshToken(user, renewToken)
        res.send({ "accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful" });
    }
    else if (!rememberMe && loc) {
        const renewToken = signRefreshToken(user)
        await saveRefreshToken(user, renewToken)
        console.log(loc)
        res.send({ "accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful" });
    }
    else if (!rememberMe && !loc) {
        await sendOTPtoUser(user, otp);
        console.log(loc)
        res.send({ "status": "otp sent to user" });
    }
    else {
        const renewToken = signRefreshToken(user)
        await saveRefreshToken(user, renewToken)
        res.send({ "accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful" });
    }
}



module.exports = { loginChecker, createOTPsecret, createOTPcode, otpValidator }