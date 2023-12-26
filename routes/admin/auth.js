const express = require("express");

const {signup,signin,trans} = require('../../controller/admin/auth');
const {currentuser} = require('../../middleware/current-user');


const authRouter = express.Router();

authRouter.post("/admin/signup",signup)
authRouter.post("/admin/signin",signin)
authRouter.get("/admin/trans",currentuser,trans)


module.exports = authRouter