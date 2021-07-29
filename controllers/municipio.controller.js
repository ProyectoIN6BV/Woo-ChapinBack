'use strict'

var Municipio = require("../models/municipio.model");
var mongoose = require("mongoose");

function createMunicipio(req, res){
    var params = req.body;
    var municipio = new Municipio();

    if(params.nameMunicipio && params.precioEnvio){
        Municipio.findOne({nameMunicipio: params.nameMunicipio}, (err, municipioFind)=>{
            if(err){
                return res.status(500).send({message:"error general al buscar",err});
            }else if(municipioFind){
                return res.send({message:"este municipio ya existe"});
            }else{
                municipio.nameMunicipio = params.nameMunicipio;
                municipio.precioEnvio = params.precioEnvio;

                municipio.save((err, muniSaved)=>{
                    if(err){
                        return res.status(500).send({message:"error general"});
                    }else if(muniSaved){
                        return res.send({message:"municipio guardado correctamente",muniSaved});
                    }else{
                        return res.status(403).send({message:"No se pudo guardar el municipio"});
                    }
                })
            }
        })
    }else{
        return res.send({message:"Ingresa los campos mínimos"});
    }
}

function getMunicipios(req,res){
    Municipio.find({},(err,municipios)=>{
        if(err){
            return res.status(500).send({message:"error general al buscar",err});
        }else if(municipios){
            return res.send({message:"Municipios encontrados:",municipios});
        }else{
            return res.send({message:"no se ha encontrado municipios registrados"});
        }
    })
}


module.exports = {
    createMunicipio,
    getMunicipios
}