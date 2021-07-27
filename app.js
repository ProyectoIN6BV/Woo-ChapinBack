'use strict'

var express = require("express");

var bodyParser = require("body-parser");

var app= express();
var userRoutes = require("./routes/user.route");
var facturaRoutes = require("./routes/factura.route");
var categoryRoutes = require("./routes/categoria.route");
var productRoutes = require("./routes/producto.route");
var carritoRoutes = require("./routes/carrito.route");
var carouselRoutes = require("./routes/carousel.route");
var municipiosRoutes = require("./routes/municipio.route");
var enviosRoutes = require("./routes/envio.route");


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});


app.use("/wooChapin",userRoutes);
app.use("/wooChapin",categoryRoutes);
app.use("/wooChapin",productRoutes);
app.use("/wooChapin",carritoRoutes);
app.use("/wooChapin",facturaRoutes);
app.use("/wooChapin",carouselRoutes);
app.use("/wooChapin",municipiosRoutes);
app.use("/wooChapin",enviosRoutes);

module.exports = app;