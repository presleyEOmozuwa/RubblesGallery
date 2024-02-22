const express = require('express');
const router = express.Router();
const { getAppUser } = require('../AppUser/appuser-service')
const { retrieveSubArchive } = require('./sub-archive-service');
const { verifyAccessToken } = require('../Utils/token.utils');

router.get('/sub/history', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        const subArchive = await retrieveSubArchive(user._id);

        res.send({ "subArchive": subArchive });
    }
    catch (err) {
        res.status(500).send({ "error": err.message });
    }
})

module.exports = router;