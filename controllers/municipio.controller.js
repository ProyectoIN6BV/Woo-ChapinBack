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

function updateMunicipio(req,res){
    var params = req.body;
    var municipioId = req.params.id;

    if(params.nameMunicipio){
        Municipio.findOne({nameMunicipio: params.nameMunicipio},(err,muniFind)=>{
            if(err){
                return res.status(500).send({message:"error al buscar"});
            }else if(muniFind){
                return res.send({message:"Municipio no disponible en uso:",muniFind});
            }else{
                Municipio.findByIdAndUpdate(municipioId,params,{new:true},(err,updated)=>{
                    if(err){
                        return res.status(500).send({message:"error general al actualizar",err});
                    }else if(updated){
                        return res.send({message:"Municipio actualizado:",updated})
                    }else{
                        return res.send({message:"no se ha podido actualizar intentelo de nuevo"});
                    }
                });
            }
        });
    }else{
        Municipio.findByIdAndUpdate(municipioId,params,{new:true},(err,updated)=>{
            if(err){
                return res.status(500).send({message:"error general al actualizar",err});
            }else if(updated){
                return res.send({message:"Municipio actualizado:",updated})
            }else{
                return res.send({message:"no se ha podido actualizar intentelo de nuevo"});
            }
        });
    }
}

module.exports = {
    createMunicipio,
    getMunicipios,
    updateMunicipio
}