const express = require("express");

const userRouter = express.Router();

const {signup,signin,history,allusers} = require("../../controller/user/user")
const {currentuser} = require("../../middleware/current-user")

userRouter.post("/user/signup",signup)
userRouter.post("/user/signin",signin)
userRouter.get("/user/history",currentuser,history)
userRouter.get("/user/all",currentuser,allusers)

module.exports = userRouter