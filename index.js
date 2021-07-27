'use strict'

var mongoose = require('mongoose');

var app = require("./app");

var port  = 3800;
var userController = require("./controllers/user.controller");
var categoryController = require("./controllers/categoria.controller");
var carouselController = require("./controllers/carousel.controller");

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/WooChapin',{useNewUrlParser:true, useUnifiedTopology:true})

.then(()=>{
    console.log("conexión correcta");
    app.listen(port,()=>{
        console.log("servidor de express corriendo",port);
        userController.createInit();
        categoryController.createCategoryDefault();
        carouselController.createCarouselDefault();
    });
})

.catch((err)=>{
    console.log("conexión incorrecta",err);
})