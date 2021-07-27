'use strict'


var express = require("express");

var envioController = require("../controllers/envio.controller");

var mdAuth = require("../middlewares/authenticates");

var api = express.Router();

api.post("/createEnvio/:id/:Uid",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],envioController.createEnvio);
api.get("/getEnvios",[mdAuth.enshureAuth],envioController.getEnvios);
api.put("/updateEnvio/:id",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],envioController.updateEnvio);
api.delete("/deleteCategory/:id",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],envioController.deleteEnvio);


module.exports = api;