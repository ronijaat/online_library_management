const express = require("express");

const {currentuser} = require('../../middleware/current-user');
const {addBook,allBooks,singleBook,assignBook,deleteBook,returnBook} = require('../../controller/book/book')

const bookRouter = express.Router();

bookRouter.post('/book/addbook',currentuser,addBook)
bookRouter.post('/book/allbooks',allBooks)
bookRouter.get('/book/singlebook/:id',singleBook)
bookRouter.post('/book/assignbook',currentuser,assignBook)
bookRouter.delete('/book/deletebook/:id',currentuser,deleteBook)
bookRouter.post('/book/return',currentuser,returnBook)





module.exports = bookRouter