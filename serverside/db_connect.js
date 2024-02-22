const mongoose = require('mongoose');

const dbconnect = async () => {
    try{
        console.log("Connecting to Mongodb Atlas Server")
        mongoose.connect(process.env.MONGODB_ATLAS_URL, {useNewUrlParser: true})
        console.log("Succesfully connected to Mongodb Atlas Server")
    }
    catch(err){
        console.log(err.message);
    }
}


module.exports = dbconnect;
