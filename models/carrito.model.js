'use strict'

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var carritoSchema = mongoose.Schema({
    detalles:[{type: Schema.ObjectId, ref:'detalle'}],
    total: Number,
    user: {type: Schema.ObjectId, ref:'user'},
});

module.exports = mongoose.model('carrito', carritoSchema);