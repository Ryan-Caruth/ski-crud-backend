const { findByEmail, createUser } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Router } = require("express");

//Register a new user
const registration = async (req, res) => {
  try {
    const { firstName, lastName, email, password, verifyPassword } = req.body;
    //Verify all required fields are filled out
    if (!firstName || !lastName || !email || !password || !verifyPassword) 
      return res.status(400).send("Please fill out all required fields");
    //Validation for password
    if (password.length < 8) 
      return res
        .status(400)
        .send("Password must be at least 8 characters long");
    if (password.search(/[a-z]/g) < 1) 
      return res
        .status(400)
        .send("Password must contain one lower case letter");
    if (password.search(/[A-Z]/g) < 1) 
      return res.status(400).send("Password must contain one uppercase letter");
    if (password.search(/[0-9]/gi) < 1) 
      return res.status(400).send("Password must contain at least one digit");
    //Verify that both passwords match
    if (password !== verifyPassword) 
      return res.status(400).send("Password does not match");
    //Check to see if user already exists
    const existingUser = await findByEmail({ email: email });
    if (existingUser) {
      return res.status(400).send("Email is already taken");
    } else if (!existingUser) {
      const createdNewUser = await createUser(req.body);
      console.log(`Created new user: ${createdNewUser.firstName}`);
      //Log the user in with an attached JWT token
      const token = jwt.sign(
        {
          user: createdNewUser._id,
        },
        process.env.JWT_SECRET
      );
      //Send token to the broswer and save the token
      res.cookie("token", token, {
        httpOnly: true,
      });
      console.log(
        `Attached token to ${token} to new user ${createdNewUser.firstName}`
      );
      res.send(createdNewUser);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

//log the user in
const login = async (req, res) => {
  try {
    const { email, password, confirmPass } = req.body;
    //validate the user
    if ((!email, !password, !confirmPass))
      return res.status(400).send("Please fill out all required fields");
    //Verify that the user exists
    const existingUser = await findByEmail({ email: email });
    if (!existingUser)
      return res.status(401).send("Wrong email or password");
    //Verify that the passwords match
    const verifyPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!verifyPassword)
      return res.status(401).send("Wrong email or password");
    //Sign the token
    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );
    //Send taken to client and save the token
    res.cookie("token", token, {
      httpOnly: true,
    }).send();
    console.log(`logged in user ${existingUser.firstName} with id of ${existingUser._id}`);
  } catch (err) {
    console.log(err)
    res.status(500).send();
  }
};

//log the user out
const logout = async (req, res) => {
  const emptyToken = "";
  res.cookie("token", emptyToken, {
    httpOnly: true,
    expires: new Date(0),
  }).send();
}

module.exports = { registration, login, logout }
