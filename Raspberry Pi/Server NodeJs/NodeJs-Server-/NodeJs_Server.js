// -*- coding: utf-8 -*-
// @author: Michał Kołomański

const mongoose = require('mongoose');
var httpServer = require('./servers/http');
var resources = require('./resources/model');

// connecting to the mongodb
mongoose.connect('mongodb://localhost/HomePageDB');
mongoose.Promise = global.Promise;

var server = httpServer.listen(resources.pi.port, '0.0.0.0', function() {
    console.info('WebSocket server works');
    console.info("It works! Port: %s", resources.pi.port);
});