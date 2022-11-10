const express = require("express");
const app = express();

PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    res.send("This will soon be the server for the Ski Crud aplication")
});

app.listen(PORT, (err) => {
    console.log(`Listening on port ${PORT}`)
})