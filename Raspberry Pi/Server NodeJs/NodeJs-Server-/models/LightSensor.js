const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Light sensor schema 
const lightSensorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name field is required']
    },
    value: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: [false]
    },
    type: {
        type: String,
        required: [false]
    },
    unit: {
        type: String,
        required: [false]
    },
    sensor_ID: {
        type: Number,
        required: [false]
    },
    sensor_address: {
        type: String,
        required: [false]
    },
    SDA: {
        type: Number,
        required: [false]
    },
    SCL: {
        type: Number,
        required: [false]
    }
});

// LightSensor model
const LightSensor = mongoose.model('lightsensor', lightSensorSchema);

module.exports = LightSensor;