const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const { getAppUser } = require('../AppUser/appuser-service');
const { signAccessToken, signRefreshToken, signRefreshTokenPlus, verifyRefreshToken, resetRefreshToken, verifyGoogleToken, saveRefreshToken } = require('../Utils/token.utils');
const { loginUser, googleloginUser } = require('./login-service');
const User = require('../Models/user-model');
const { assignCartToUser } = require('../Utils/cart-util');
const { loginChecker, createOTPsecret, createOTPcode, otpValidator } = require('./login-helper');
const speakeasy = require('speakeasy');


router.post("/login/payload", async (req, res) => {
    try {
        const authUser = await loginUser(req.body.email, req.body.password);
        
        const updateduser = await createOTPsecret(authUser);
        const otp = createOTPcode(updateduser.otpsecret);
        
        await loginChecker(updateduser, req.body.useToken, req.sessionID, req.body.rememberMe, res, otp);
    }
    catch (err) {
        const { message } = err;
        if (message === "email and password fields are required" || message === "email is associated to a closed account" || message === "email is associated to a blocked account" || message === "invalid email or password") {
            res.status(400).send({ error: message })
        }
        else {
            res.status(500).send({ error: message })
        }
    }
});

router.post("/otp-code", async (req, res) => {
    try {
        const { code, userId } = req.body.payload;

        const user = await getAppUser(userId);
        let otpsecret = user.otpsecret;

        otpValidator(String(otpsecret), String(code));

        const renewToken = signRefreshTokenPlus(user);
        await saveRefreshToken(user, renewToken);
        
        res.send({ "accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful" });
    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }

});


router.post("/google-signin", async (req, res) => {
    try {
        // VERIFY GOOGLE CREDENTIALS
        const { clientId, token } = req.body.payload
        const payload = await verifyGoogleToken(clientId, token);

        const user = await googleloginUser(payload);

        if (user) {
            const renewToken = signRefreshTokenPlus(user)
            await saveRefreshToken(user, signRefreshTokenPlus(user));

            res.send({ "accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful", "isloggedIn": true });
        }
        else {
            const customer = await stripe.customers.create({
                email: payload.email
            });

            const logger = await User.create({
                username: google,
                email: payload.email,
                password: identity,
                role: "client",
                stripecustomerid: customer.id,
                terms: true
            });

            if (!logger) {
                throw new Error("google logger registration failed");
            }

            await assignCartToUser(logger);

            const renewToken = signRefreshToken(logger)
            await saveRefreshToken(logger, renewToken);

            res.send({ "accToken": signAccessToken(logger), "renewToken": renewToken, "status": "login successful", "isloggedIn": true });
        }

    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});

//REQUEST TO LOGOUT
router.put("/logout/payload", async (req, res) => {

    try {
        const decodedToken = await verifyRefreshToken(req.body.renewtoken)

        const userId = decodedToken.user.id;
        const user = await getAppUser(userId);
        await resetRefreshToken(user, req.body.renewtoken);
        res.send({ "status": "logout was successful and Token Store resets" });

    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
});



// REQUEST TO RENEW ACCESS TOKEN
router.post("/refresh-token/payload", async (req, res) => {
    try {
        const decodedToken = await verifyRefreshToken(req.body.backupToken);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        await resetRefreshToken(user, req.body.backupToken);

        const accToken = signAccessToken(user);
        const renewToken = signRefreshToken(user);

        await saveRefreshToken(user, renewToken);

        res.send({ "entryToken": accToken, "renewToken": renewToken, "status": "login successful" });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }

});


module.exports = router;