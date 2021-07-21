'use strict'

var facturaController = require("../controllers/factura.controller");

var express = require("express");

var mdAuth = require("../middlewares/authenticates");

var api = express.Router();


api.get("/:userId/verMisFacturas",[mdAuth.enshureAuth],facturaController.verMisFacturas);
api.post("/:userId/crearFactura",[mdAuth.enshureAuth],facturaController.crearFactura);
api.get("/:userId/buscarFacturaUsuario",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],facturaController.buscarFacturaAdmin);
api.get("/:facturaId/buscarFacturaProductos",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],facturaController.BuscarFacturaProducto);
api.get("/verFacturas",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],facturaController.getFacturasAdmin);
module.exports = api;