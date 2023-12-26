const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const dbConnect = async() =>{
    const db = process.env.DB
    try{
        mongoose.connect(db)
    }
    catch(err){
        console.log("Error in connecting to the database")
        }
}
module.exports = dbConnect;
