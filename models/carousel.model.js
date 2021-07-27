'use strict'

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var carouselSchema = mongoose.Schema({
    name: String,
    images: 
        [{
            image: String
         }]
});

module.exports = mongoose.model('carousel', carouselSchema);