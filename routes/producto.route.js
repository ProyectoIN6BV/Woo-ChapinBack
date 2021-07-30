'use strict'

var express = require("express");

var productoController = require("../controllers/producto.controller");
var mdAuth = require("../middlewares/authenticates");
var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/producto'});
var api = express.Router();

api.post("/createProduct",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],productoController.createProduct);
api.get("/getProducts",productoController.getProducts);
api.get("/getProductsCategory/:id",productoController.getProductsCategory);
api.post("/searchProduct",[mdAuth.enshureAuth],productoController.searchproduct);
api.put("/updateProduct/:productId",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],productoController.updateProduct);
api.put("/updateStock/:productId",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],productoController.updateStock);
api.get("/viewStock/:productId",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],productoController.viewStock);
api.get("/getProductId/:productId",productoController.getProductById);
api.get("/getProductTag/:productId",productoController.getProductsTag);
api.get("/bestSellers",productoController.viewProductsBest);
api.get("/newProduct",productoController.viewNewProduct);

api.get("/productosAgotados",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],productoController.viewproductsAgotados);
api.put("/deleteProduct/:productId",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],productoController.deleteProduct);
api.put('/uploadImgProd/:id',[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin, mdUpload],productoController.uploadImgProd);
api.get("/getImgProd/:fileName",[mdUpload],productoController.getImgProd);

module.exports = api;