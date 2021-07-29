'use strict'

var express = require("express");

var productoController = require("../controllers/producto.controller");
var mdAuth = require("../middlewares/authenticates");
var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/producto'});
var api = express.Router();

api.post("/createProduct",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],productoController.createProduct);
api.get("/getProducts",[mdAuth.enshureAuth],productoController.getProducts);
api.post("/searchProduct",[mdAuth.enshureAuth],productoController.searchproduct);
api.put("/updateProduct/:productId",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],productoController.updateProduct);
api.put("/updateStock/:productId",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],productoController.updateStock);
api.get("/viewStock/:productId",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],productoController.viewStock);
api.get("/bestSellers",[mdAuth.enshureAuth],productoController.viewProductsBest);
api.get("/productosAgotados",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],productoController.viewproductsAgotados);
api.delete("/deleteProduct/:productId",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],productoController.deleteProduct);
api.put('/uploadImgProd/:id',[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin, mdUpload],productoController.uploadImgProd);
api.get("/getImgProd/:fileName",[mdUpload],productoController.getImgProd);

module.exports = api;