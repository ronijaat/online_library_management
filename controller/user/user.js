const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../../model/user");

const signup = async (req, res) => {
  try {
    const { name, username, email, password, number } = req.body;

    if (!name || !username || !email || !password || !number) {
      return res.status(400).json({ message: "Data Missing" });
    }

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User Already Existing" });
    }

    existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username Already Existing" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword, // Save the hashed password
      number,
    });

    const savedUser = await newUser.save();
    return res.status(200).json({ username: savedUser.username });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Data Missing" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY);
    req.session.jwt = token;

    return res.status(200).json({ username: user.username });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const history = async (req, res) => {
  try {
    let { _id, email } = req.currentUser;
    let data = await User.findOne({ email }).populate({
      path: "books",
      select:
        "title url issuedAt forDays shouldBeReturnOn onRealItReturned isLateToSubmit daysLeft",
      populate: {
        path: "bookId",
        select: "title url",
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

const allusers = async (req, res) => {
  try {
    console.log("users")
    let data = await User.find({}).populate({
      path: "books",
      select:
        "title url issuedAt forDays shouldBeReturnOn onRealItReturned isLateToSubmit daysLeft",
      populate: {
        path: "bookId",
        select: "title url",
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  signup,
  signin,
  history,
  allusers,
};
