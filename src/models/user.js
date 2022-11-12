const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    winterActivity: {
        type: [String],
        required: true,
    },
    skillLevel: {
        type: [String],
        required: true,
    },
},
    { timestamps: true }
);

const User = model("user", userSchema);

//Find user by email to be able to log in
const findByEmail = async (email) => {
    try {
        let existingUser = await User.findOne(email)
        return existingUser
    } catch (err) {
        console.log(err)
        res.status(400).send();
    }
}

//Create a new user with a hashed password
const createUser = async (newUserData) => {
    const hashedPassword = bcrypt.hashSync(
        newUserData.password,
        10
    );
    //Add new user to db
    const newUser = await User.create({
        ...newUserData,
        password: hashedPassword,
    });
    return newUser
}

module.exports = { findByEmail, createUser };