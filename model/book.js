const mongoose = require("mongoose");

const bookModel = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true,
    },
    count: {
        type: Number,
        required: true
    },
    url : {
        type : String,
        required : true,
    },
    addBy : {
        type : String,
        required : true,
    }
})

const Book = new mongoose.model("Book",bookModel);

module.exports = Book