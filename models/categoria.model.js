'use strict'

var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var categoriaModel = mongoose.Schema({
    nameCategoria: String,
    descCategoria: String

});


module.exports = mongoose.model('categoria',categoriaModel);