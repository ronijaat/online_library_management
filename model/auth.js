const mongoose = require("mongoose");

const authModel = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    number : {
        type : String,
        required : true
    }
})

const Admin = new mongoose.model("admin",authModel);

module.exports = Admin