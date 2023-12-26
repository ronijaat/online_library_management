const express = require("express");

const userRouter = express.Router();

const {signup,signin,history,allusers} = require("../../controller/user/user")
const {currentuser} = require("../../middleware/current-user")
const {currentus} = require("../../middleware/user-login")


userRouter.post("/user/signup",signup)
userRouter.post("/user/signin",signin)
userRouter.get("/user/history",currentus,history)
userRouter.get("/user/all",currentuser,allusers)

module.exports = userRouter