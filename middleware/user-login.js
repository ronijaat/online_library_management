const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config();

const currentuser = async(req,res,next)=>{
    try{
        if(!req.session?.jwt){
            return res.status(401).send({message:"No session available"})
        }
        //Verify JWT token
        let user = await jwt.verify(req.session.jwt,process.env.SECRET_KEY);
        if(!user){
            return res.status(401).send({message:"Invalid Token"})
        }else{
            req.currentUser=user;
            next()
        }
    }catch(err){
        console.log("Error in getting the user details", err);
        res.status(500).json({message: "Internal Server Error"});
    }

}

module.exports = {
    currentuser
}