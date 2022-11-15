const express = require("express");
const app = express();
const mongoose = require('./config/mongoose');
const userRoutes = require('./routes/user');

PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", userRoutes)

app.get("/", async (req, res) => {
    res.send("This will soon be the server for the Ski Crud application")
});

app.listen(PORT, (err) => {
    console.log(`Listening on port ${PORT}`)
})