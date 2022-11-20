require('dotenv').config()
const express = require('express')

const app = express()

app.get('/home', (req, res) => {
    res.send("<h1>Server is Working..</h1>");
})

module.exports = app