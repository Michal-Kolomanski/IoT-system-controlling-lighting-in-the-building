const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var resources = require('./../resources/model');
var sensor_routes = require('./../routes/sensors');
var converter = require('./../data_converters/converter');

// creating express app
var app = express();

app.use(bodyParser.json());

app.use(cors());

// initialize routes
app.use('/pi/Rooms', sensor_routes);

app.get('/pi', function(req, res) {
    res.send("Welcome to your home")
})

app.get('', function(req, res) {
    res.send("Welcome to your home")
})


// error handling
app.use(function(err, req, res, next) {
    res.status(400).send({ error: err.message });
});

app.use(converter());


module.exports = app;