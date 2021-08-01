'use strict'

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var coloresSchema = mongoose.Schema({
    coloresName: String,
    primario: String,
    secundario: String
});

module.exports = mongoose.model('colores', coloresSchema);