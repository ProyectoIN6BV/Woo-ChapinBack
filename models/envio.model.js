'use strict'

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var envioSchema = mongoose.Schema({
    nameReceiver: String,
    lastNameReceiver: String,
    phone: String,
    address: String,
    specificAddress: String,
    reference: String,
    municipio: [{type: Schema.ObjectId, ref:'municipio'}]
});


module.exports =  mongoose.model('envio',envioSchema);