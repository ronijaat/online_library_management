const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const dotenv = require("dotenv");
dotenv.config();

const Admin = require("../../model/auth");
const Transaction = require("../../model/trans")

const signup = async (req, res) => {
  try {
    const { name, username, email, password, number } = req.body;

    if (!name || !username || !email || !password || !number) {
      return res.status(400).json({ message: "Data Missing" });
    }

    let user = await Admin.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User Already Existing" });
    }

    user = await Admin.findOne({ username });

    if (user) {
      return res.status(400).json({ message: "Username Already Existing" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); 

    const admin = new Admin({
      name,
      username,
      email,
      password: hashedPassword, // Save the hashed password
      number
    });
    const savedAdmin = await admin.save();
    return res.status(200).json({username : savedAdmin.username});
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const signin = async (req,res)=>{
  try{
    const SECRET_KEY = process.env.SECRET_KEY;
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Data Missing" });
    }
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password);
    if(!isPasswordMatch){
      return res.status(400).json({message:"Invalid Password!"});
    }
    const token = jwt.sign({id:user._id,email:user.email},SECRET_KEY)
    req.session.jwt_token = token;

    return res.status(200).json({username:user.username});


  }catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

const trans = async(req,res)=>{
  try{
    let data = await Transaction.find()
                .populate("user","username email")
                .populate("book","title count url")
                .sort('-date');
    return res.status(200).json(data);
  }
  catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = {
  signup,
  signin,
  trans
};
