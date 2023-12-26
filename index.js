const express = require("express")
const cors= require("cors");
const session = require('express-session');

const dotenv = require("dotenv");
dotenv.config();

const dbConnect = require("./db/conn");
const authRouter = require("./routes/admin/auth")
const bookRouter = require("./routes/book/book.routes")
const userRouter = require("./routes/user/user");

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(session({
    secret: process.env.SECRET_KEY, // Replace with a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000000, // Session expiration time in milliseconds (1 hour in this example)
      // other optional settings
      // domain: 'yourdomain.com',
      // path: '/somepath',
    }
  }));

app.use(express.static('build'));
app.use(authRouter)
app.use(bookRouter)
app.use(userRouter)




const startUp = async()=>{
    await dbConnect();
}
app.listen(8000,()=>{
    startUp()
    console.log('Server is running on port 8000')
})