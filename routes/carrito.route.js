'use strict'

var express = require("express");
var carritoController = require("../controllers/carrito.controller");

var mdAuth = require("../middlewares/authenticates");

var api = express.Router();

api.post("/:userId/agregarCarrito/:productId",[mdAuth.enshureAuth],carritoController.AgregarCarrito);
api.put("/:userId/deleteProductoCarrito/:productId",[mdAuth.enshureAuth],carritoController.eliminarProductoCarrito);
api.delete("/:userId/deleteProductoCompletoCarrito/:productId",[mdAuth.enshureAuth],carritoController.eliminarDetalle);
api.get("/:userId/viewCarrito",[mdAuth.enshureAuth],carritoController.viewCarrito);
module.exports = api;   