require('dotenv').config()
require('./database/database').connect()
const express = require('express')

const app = express()
app.use(express.json);

app.get('/', (req, res) => {
    res.send("<h1>Server is Working..</h1>");
});

app.post("/register", async (req, res) => {
    try {
        // Get All Data From Body
        const [firstname, lastname, email, password] = req.body;

        // All the data should be exist
        if(!firstname || !lastname || !email || !password){
            throw new Error("Please Provide all the data");
        }

        // check if user already exist

        // encrypt the password

        // save the user in DB

        // generate the token for user and send it
        
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = app;