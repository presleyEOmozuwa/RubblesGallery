const RefreshToken = require('../Models/refreshToken-model');

const getRefreshToken = async (userId) => {
    const token = await RefreshToken.findOne({userId: userId});
    return token;
}

const retrieveRefreshToken = async (userId) => {
    const doc = await RefreshToken.findOne({userId: userId});
    
    if(!doc){
        throw new Error("refresh token document not found")
    }
    
    return doc;
}


module.exports = { getRefreshToken, retrieveRefreshToken }