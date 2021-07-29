'use strict'

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var municipioSchema = mongoose.Schema({
    nameMunicipio: String,
    precioEnvio: Number
});


module.exports =  mongoose.model('municipio',municipioSchema);