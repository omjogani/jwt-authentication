require("dotenv").config();
require("./database/database").connect();
const User = require("./model/user");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')

const app = express();
app.use(express.json);
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("<h1>Server is Working..</h1>");
});

app.post("/register", async (req, res) => {
  try {
    // Get All Data From Body
    const { firstname, lastname, email, password } = req.body;

    // All the data should be exist
    if (!firstname || !lastname || !email || !password) {
      res.status(400).send("Please Provide all required details...");
    }

    // check if user already exist : email
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      res.status(401).send("User is already Exist...");
    }

    // encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // save the user in DB
    const savedUser = await User.create({
      firstname,
      lastname,
      email,
      password: encryptedPassword,
    });

    // generate the token for user and send it
    const token = jwt.sign(
      { id: savedUser._id, email },
      "shhhhh", // process.env.jwtsecret,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    user.password = undefined;

    res.status(201).json(user);
  } catch (error) {
    throw new Error(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    // get all data from body
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      res.status(401).send("Please provide required data...");
    }

    // find user in db
    const userData = await User.findOne({ email });
    if (!userData) {
      res.status(401).send("Please Register First before Login");
    }

    // match the password
    const isAuthenticationValid = await bcrypt.compare(
      password,
      userData.password
    );
    if (!isAuthenticationValid) {
      res.status(401).send("Invalid Credentials");
    }

    const token = jwt.sign(
      { id: userData._id },
      "shhhhh", // process.env.jwtsecret,
      {
        expiresIn: "2h",
      }
    );
    user.token = token
    user.password = undefined

    // send a token cookie
    const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user: userData,
    });

  } catch (error) {
    throw new Error(error);
  }
});

module.exports = app;
