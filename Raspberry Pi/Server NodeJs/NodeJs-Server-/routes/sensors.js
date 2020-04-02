const express = require('express');
const mongoose = require('mongoose');
const resources = require('./../resources/model');
const LightSensor = require('../models/LightSensor');

const router = express.Router();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// GET

router.route('/').get(function(req, res, next) {
    req.result = resources.pi.Rooms;
    next();
});


router.route('/LivingRoom').get(function(req, res, next) {
    req.result = resources.pi.Rooms.LivingRoom;
    next();
});

router.route('/LivingRoom/sensors').get(function(req, res, next) {
    req.result = resources.pi.Rooms.LivingRoom.sensors;
    next();
});

router.route('/LivingRoom/devices').get(function(req, res, next) {
    req.result = resources.pi.Rooms.LivingRoom.devices;
    next();
});

router.route('/LivingRoom/sensors/Light').get(function(req, res, next) {
    req.result = resources.pi.Rooms.LivingRoom.sensors.Light;
    next();
});

router.route('/LivingRoom/sensors/Light/:id').get(function(req, res, next) {
    LightSensor.findOne({ _id: req.params.id }).then(function(lightsensor) {
        req.result = lightsensor;
        next();
    });
});

// POST
router.route('/LivingRoom/sensors/Light').post(function(req, res, next) {
    console.log("");
    console.log("A sensor was created");
    console.log(req.body);
    LightSensor.create(req.body).then(function(lightsensor) { // it can take some time, so we need to wait 
        res.send(lightsensor);
    }).catch(next); // if there was an error call the next parameter
});

// PUT
router.route('/LivingRoom/sensors/Light/:id').put(function(req, res, next) {
    console.log("");
    console.log("There was a put request for the light sensor with ID: ", req.params.id);
    console.log(req.body);
    LightSensor.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function() {
        LightSensor.findOne({ _id: req.params.id }).then(function(lightsensor) {
            res.send(lightsensor);
        })
    });
});

// DELETE
router.route('/LivingRoom/sensors/Light/:id').delete(function(req, res, next) {
    LightSensor.findByIdAndRemove({ _id: req.params.id }).then(function(lightsensor) {
        res.send(lightsensor);
    });
});

module.exports = router;