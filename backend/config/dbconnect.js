const mongoose = require("mongoose");
async function dbConnect(DB_URL){
    try{
        await mongoose.connect(DB_URL);
        console.log("DataBase Connected Successfully");
    }
    catch(error){
        console.log(error);
    }
}
module.exports = dbConnect;