require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
const wofDataRoutes = require('./routes/wofDataRoute') //Routes

//express app

const app = express ()
const PORT = process.env.PORT || 8000;

app.use(wofDataRoutes);

//msg
app.get('/', (req, res) => {
    res.json({mssg:'Server ON'})
})

//connect db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        //requests
        app.listen(process.env.PORT, () => {
            console.log('Listen port:', 'http://localhost:' + process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })

//requests
//app.listen(process.env.PORT, () => {
  //  console.log('Listen port:', process.env.PORT)
//})
