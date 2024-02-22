const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../Utils/token.utils');
const { getAppUser, upDateUserName, upDateEmail, upDatePassword } = require('../AppUser/appuser-service');
const { saveOldEmail, passwordChecker } = require('./account-update-service')

router.put('/username/update', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;
        
        const user = await getAppUser(userId);

        const { username } = req.body.payload

        await upDateUserName(user, username);

        res.send({"status": "username updated successfully"});

    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }

});

router.put('/email/update', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;
        
        const user = await getAppUser(userId);

        const { email } = req.body.payload;

        if(email === user.email){
            throw new Error("provide a new email address");
        }

        await saveOldEmail(user, email);

        await upDateEmail(user, email);

        res.send({"status": "email updated successfully"});

    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }

});

router.put('/passwordchange/update', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;
        
        const user = await getAppUser(userId);

        const { oldPassword, newPassword } = req.body.payload

        const checked = await passwordChecker(user, oldPassword);

        if(!checked){
            throw new Error("old password is invalid")
        }
        
        await upDatePassword(user, newPassword);

        res.send({"status": "password changed successfully"});

    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }

});



module.exports = router;