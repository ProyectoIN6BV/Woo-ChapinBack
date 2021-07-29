'use strict'

var express = require("express");
var categoryController = require("../controllers/categoria.controller");
var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/categoria'});
var mdAuth = require("../middlewares/authenticates");

var api = express.Router();

api.post("/createCategory",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],categoryController.createCategory);
api.get("/getCategory",[mdAuth.enshureAuth],categoryController.getCategory);
api.put("/updateCategory/:categoryId",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],categoryController.updateCategory);
api.delete("/deleteCategory/:categoryId",[mdAuth.enshureAuth,mdAuth.enshureAuthAdmin],categoryController.deleteCategory);
api.put('/uploadImgProd/:id',[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin, mdUpload],categoryController.uploadImgCat);
api.get("/getImgProd/:fileName",[mdUpload],categoryController.getImgCat);


module.exports = api;