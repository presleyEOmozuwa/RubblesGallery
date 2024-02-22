const express = require('express');
const router = express.Router();
const { getAllUsers, getAppUser, upDateUser, deleteUser } = require('./appuser-service');
const { verifyAccessToken } = require('../Utils/token.utils');
const { saveDeletedUser } = require('../Utils/user-utils');

router.get('/users', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const { count, page } = req.query;

        const adminId = decodedToken.user.id;
        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            const users = await getAllUsers(count, page);
            res.send({ "users": users });
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
});


router.get('/user', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id

        const user = await getAppUser(userId)

        res.send({ "user": user });
    }
    catch (err) {
        res.status(500).send({ "error": err.message });
    }
})

router.put('/update/user', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id

        const user = await getAppUser(userId)

        await upDateUser(user._id, req.body.payload);

        res.send({ "status": "user updated successfully" });
    }
    catch (err) {
        res.status(500).send({ "error": err.message });
    }
})

router.delete('/delete/user/:userId', async (req, res) => {
    try {
        const user = await getAppUser(req.params.userId);

        const { removedUser } = await deleteUser(user._id);

        await saveDeletedUser(removedUser);

        res.send({ "Status": "user deleted successfully" });
    }
    catch (err) {
        res.status(500).send({ "error": err.message });
    }
})


module.exports = router