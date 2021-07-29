'use strict'

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var productoSchema = mongoose.Schema({
    nameProducto: String,
    descProducto: String,
    precio: Number,
    tags:[],
    stock: Number,
    cantidadVendida: Number,
    imgProducto: String,
    categoria: [{type: Schema.ObjectId, ref:'categoria'}]
});


module.exports =  mongoose.model('producto',productoSchema);