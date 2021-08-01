'use strict'

var express = require("express");
var carouselController = require("../controllers/carousel.controller");

var mdAuth = require("../middlewares/authenticates");
var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/carousel'});
var api = express.Router();


api.put('/uploadImgCarousel/:id',[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin, mdUpload],carouselController.uploadImgCarousel);
api.get("/getImageCarousel/:fileName",[mdUpload],carouselController.getImageCarousel);
api.delete("/deleteImgCarousel/:id",[mdAuth.enshureAuth],carouselController.deleteImgCarousel);
api.get("/getImageName",carouselController.getImageName);
module.exports = api;