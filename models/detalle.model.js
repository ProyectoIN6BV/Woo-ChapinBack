'use strict'


var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var detalleSchema = Schema({
    producto: {type: Schema.ObjectId, ref:'producto'},
    cantidad: Number,
    subTotal: Number
});


module.exports = mongoose.model("detalle",detalleSchema);