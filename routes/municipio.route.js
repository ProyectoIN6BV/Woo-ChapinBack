'use strict'


var express = require("express");

var MunicipioController = require("../controllers/municipio.controller");
var mdAuth = require("../middlewares/authenticates");

var api = express.Router();

api.post("/createMunicipio",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],MunicipioController.createMunicipio);
api.get("/getMunicipios",[mdAuth.enshureAuth],MunicipioController.getMunicipios);
api.put("/updateMunicipio/:id",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],MunicipioController.updateMunicipio);
api.put('/deleteMunicipio/:id', [mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],MunicipioController.deleteMunicipio); //Eliinar un jugador.

module.exports = api;