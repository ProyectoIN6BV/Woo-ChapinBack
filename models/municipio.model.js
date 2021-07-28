'use strict'

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var municipioSchema = mongoose.Schema({
    nameMunicipio: String,
    nameDepartamento: String
});


module.exports =  mongoose.model('municipio',municipioSchema);