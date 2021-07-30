'use strict'

var express = require("express");

var userController = require("../controllers/user.controller");

var mdAuth = require("../middlewares/authenticates");

var api = express.Router();

api.get("/getusers",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],userController.getUsers);
api.post("/login",userController.login);
api.post("/register",userController.createUsuario);
api.put("/modificarRole/:userId",[mdAuth.enshureAuth, mdAuth.enshureAuthAdmin],userController.modifyRole);
api.put("/editAccount/:userId",[mdAuth.enshureAuth],userController.modifyUser);
api.delete("/deleteAccount/:userId",[mdAuth.enshureAuth],userController.deleteUser);
api.put("/addAddress/:id",[mdAuth.enshureAuth],userController.addAddress);
api.delete("/removeAddress/:id",[mdAuth.enshureAuth],userController.removeAddress);


module.exports = api;