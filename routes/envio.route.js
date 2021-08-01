'use strict'


var express = require("express");

var envioController = require("../controllers/envio.controller");

var mdAuth = require("../middlewares/authenticates");

var api = express.Router();

api.post("/createEnvio/:id/:Uid/:facId",[mdAuth.enshureAuth],envioController.createEnvio);
api.get("/getEnvios/:id",[mdAuth.enshureAuth],envioController.getEnvios);
api.put("/updateEnvio/:id",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],envioController.updateEnvio);
api.delete("/deleteCategory/:id",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],envioController.deleteEnvio);
api.get("/getEnviosAdmin",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],envioController.getEnviosAdmin);
api.get("/getFac/:id",[mdAuth.enshureAuth],envioController.getFac);



module.exports = api;