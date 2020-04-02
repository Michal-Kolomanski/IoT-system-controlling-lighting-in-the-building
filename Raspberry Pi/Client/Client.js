// -*- coding: utf-8 -*-
// @author: Michał Kołomański

const Yeelight = require('node-yeelight');
const request = require('request');

var y = new Yeelight;
var state = false;

// Define how many lux in the room do you want
const how_many_lux = 40;

// Path to the sensor 
const hostname = 'http:// Server IP',
    port = 80,
    sensor_url = '/pi/Rooms/LivingRoom/sensors/Light/5dec517737d254054be8f766';

const link = hostname + ":" + port + sensor_url;


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

// Scan network for active Yeelights
y.on('ready', function() {
    console.log('Scanning the network');
    y.discover();
});

// Connect to the device
y.on('deviceadded', function(device) {
    y.connect(device);
    console.log('Device added');
});

// Get lux value from the sensor
function GetLuxValue() {
    return new Promise(resolve => {
        request(link, { json: true }, (err, res, body) => {
            if (err) { reject(err); } else {
                resolve(JSON.parse(body.value));
            }
        })
    })
};

function GetMaxValue() {
    return new Promise(resolve => {
        request(link, { json: true }, (err, res, body) => {
            if (err) { reject(err); } else {
                resolve(JSON.parse(body.value));
            }
        })
    })
};

function GetMinValue() {
    return new Promise(resolve => {
        request(link, { json: true }, (err, res, body) => {
            if (err) { reject(err); } else {
                resolve(JSON.parse(body.value));
            }
        })
    })
};

y.on('deviceconnected', function(device) {
    setInterval(function() {
        console.log("elo");
        sleep(3000);
        GetLuxValue().then(function(res) {
                const Lux = res;
                return Lux;
            })
            .then(function(Lux) {
                console.log(Lux);
                console.log(Lux < how_many_lux);
                if (Lux < how_many_lux) {

                    if (state === false) {
                        console.log("Power on the device");
                        state = true;
                        y.setPower(device, state, 300);
                    }

                    Brightness_percentage = 1;
                    y.setBrightness(device, Brightness_percentage, 300);
                    console.log("Brightness is set on: %s%", Brightness_percentage);

                    sleep(3000);
                    Promise.all([
                            GetMinValue()
                        ])
                        .then(res => {
                            var min = res[0];


                            Brightness_percentage = 100;
                            y.setBrightness(device, Brightness_percentage, 300);
                            console.log("Brightness is set on: %s%", Brightness_percentage);
                            sleep(3000);
                            Promise.all([
                                    GetMaxValue()
                                ])
                                .then(res => {
                                    var max = res[0];
                                    sleep(3000);
                                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                                    console.log("Lux: ", Lux);
                                    console.log("min: ", min);
                                    console.log("max: ", max);
                                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

                                    var counter = 0;

                                    if (how_many_lux < min) {
                                        console.log("Power off the device");
                                        state = false;
                                        y.setPower(device, state, 300);
                                        counter++;
                                        sleep(55000);
                                        // sleep(3000);
                                    }
                                    if (how_many_lux > max) {
                                        counter++;
                                        // sleep(3000);
                                        sleep(55000);
                                    }

                                    if (counter === 0) {
                                        if (how_many_lux === min) {
                                            var calc_Brightness_percentage = 1;
                                        } else {
                                            sleep(3000);
                                            var factor = (max - min) / 100;
                                            var calc_Brightness_percentage = Math.round((how_many_lux - min) / factor);
                                        }
                                        y.setBrightness(device, calc_Brightness_percentage, 300);
                                        console.log("Brightness is set on: %s%", calc_Brightness_percentage);
                                        // sleep(3000);
                                        GetLuxValue().then(function(res) {
                                            console.log(res);
                                        })

                                        sleep(55000);
                                    }
                                })
                        })
                } else {
                    if (state === true) {
                        console.log("Power off the device");
                        state = false;
                        y.setPower(device, state, 300);
                    }
                }
            })
    }, 60000);
});

y.listen();