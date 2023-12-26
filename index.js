const express = require("express")
const cors= require("cors");
const session = require('express-session');

const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 8000

const dbConnect = require("./db/conn");
const authRouter = require("./routes/admin/auth")
const bookRouter = require("./routes/book/book.routes")
const userRouter = require("./routes/user/user");

const app = express();

app.use(cors());
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

dbConnect().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})
