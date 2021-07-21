'use strict'

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var facturaSchema = mongoose.Schema({
    detalles:[{type: Schema.ObjectId, ref:'detalle'}],
    fecha: String, 
    total:Number,
    nit: String,
    user: {type: Schema.ObjectId, ref:'user'},
});

module.exports = mongoose.model('factura',facturaSchema);