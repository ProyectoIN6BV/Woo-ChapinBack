'use strict'

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    name: String,
    lastName:String,
    userName: String,
    password: String,
    email: String,
    phone: String,    
    role: String,
    facturas: [{type: Schema.ObjectId, ref: 'factura'}],
    envios: [{type: Schema.ObjectId, ref: 'envio'}]
});



module.exports = mongoose.model('user',userSchema);