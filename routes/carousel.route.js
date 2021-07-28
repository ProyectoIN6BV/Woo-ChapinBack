'use strict'

var express = require("express");
var carouselController = require("../controllers/carousel.controller");

var mdAuth = require("../middlewares/authenticates");

var api = express.Router();


api.put('/uploadImgCarousel/:id',[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],carouselController.uploadImgCarousel);
api.get("/getImageCarousel/:fileName",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],carouselController.getImageCarousel);
api.delete("/deleteImgCarousel/:id",[mdAuth.enshureAuth],carouselController.deleteImgCarousel);

module.exports = api;