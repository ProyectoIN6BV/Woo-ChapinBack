'use strict'


var Colores = require("../models/colores.model");

function coloresDefault(req,res){
    var coloresName = "DEFAULT";
    var primario = "#2269de";
    var secundario = "#1F2021";
    var colores = new Colores();

    Colores.findOne({coloresName: "DEFAULT"}, (err, coloresFind)=>{
        if(err){
            console.log("error al buscar",err);
        }else if(coloresFind){
            console.log("colores por default creado");
        }else{
            colores.coloresName = coloresName;
            colores.primario = primario;
            colores.secundario = secundario;

            colores.save((err,coloresSaved)=>{
                if(err){
                    console.log("error al guardar",err);
                }else if(coloresSaved){
                    console.log("colores guardados correctamente");
                }else{
                   console.log("No se pudo guardar los colores");
                }
            })
        }
    })
}

function getColores(req,res){
    var coloresName = "DEFAULT";

    Colores.findOne({coloresName: coloresName}, (err, coloresFind)=>{
        if(err){
            return res.status(500).send({message:"error general al buscar",err});
        }else if(coloresFind){
            return res.send({message:"Colores encontrados:",coloresFind});
        }else{
            return res.send({message:"no se ha encontrado colores registradas"});
        }
        })
    }

function updateColores(req,res){
    var params = req.body;
    var colorId = req.params.id;

    Colores.findByIdAndUpdate(colorId, params,{new:true},(err,updated)=>{
        if(err){
            return res.status(500).send({message:"error general al buscar",err});
        }else if(updated){
            return res.send({message:"Colores actualizados:",updated});
        }else{
            return res.send({message:"no se ha encontrado colores registrados"});
        }
    });
}


module.exports = {
    updateColores,
    getColores,
    coloresDefault
}