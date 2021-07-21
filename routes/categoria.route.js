'use strict'


var express = require("express");

var categoryController = require("../controllers/categoria.controller");

var mdAuth = require("../middlewares/authenticates");

var api = express.Router();

api.post("/createCategory",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],categoryController.createCategory);
api.get("/getCategory",[mdAuth.enshureAuth],categoryController.getCategory);
api.put("/updateCategory/:categoryId",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],categoryController.updateCategory);
api.delete("/deleteCategory/:categoryId",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],categoryController.deleteCategory);


module.exports = api;