'use strict'
'use strict'
const mongoose = require('mongoose');
const TrafficSchema = new mongoose.Schema({
    name:String,
    bikeno:String,
    email:String,
    Photoname:String,
    message:String
});
const TrafficModel = mongoose.model('trafficdata', TrafficSchema);
module.exports = TrafficModel;