'use strict'


var express = require("express");

var MunicipioController = require("../controllers/municipio.controller");
var mdAuth = require("../middlewares/authenticates");

var api = express.Router();

api.post("/createMunicipio",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],MunicipioController.createMunicipio);
api.get("/getMunicipios",[mdAuth.enshureAuth],MunicipioController.getMunicipios);


module.exports = api;