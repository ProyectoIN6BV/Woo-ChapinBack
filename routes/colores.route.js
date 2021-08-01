'use strict'

var express = require("express");
var coloresController = require("../controllers/colores.controller");
var mdAuth = require("../middlewares/authenticates");

var api = express.Router();

api.get("/getColores",coloresController.getColores);
api.put("/updateColores/:id",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],coloresController.updateColores);


module.exports = api;