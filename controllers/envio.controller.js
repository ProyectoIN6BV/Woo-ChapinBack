'use strict'

var Envio = require("../models/envio.model");
var User = require("../models/user.model");
var Factura = require("../models/factura.model");

function createEnvio(req, res){
    var params = req.body;
    var envio = new Envio();
    var muniId = req.params.id;
    var userId = req.params.Uid;
    var facId = req.params.facId;
    if(params.nameReceiver && params.lastNameReceiver && params.phone && params.address && params.specificAddress && params.reference){
        
        envio.nameReceiver = params.nameReceiver;
        envio.lastNameReceiver = params.lastNameReceiver;
        envio.phone = params.phone;
        envio.address = params.address;
        envio.specificAddress = params.specificAddress;
        envio.reference = params.reference;
        envio.factura = facId;

        envio.save((err, envioSaved)=>{
            if(err){
                return res.status(500).send({message:"error general"});
            }else if(envioSaved){
                Envio.findByIdAndUpdate(envioSaved._id,{$push:{municipio:muniId}},{new:true},(err,municipioUpdate)=>{
                    if(err){
                        return res.status(500).send({message:"error general"});
                    }else if(municipioUpdate){
                        User.findByIdAndUpdate(userId,{$push:{envios:envioSaved._id}},{new:true},(err,userUpdate)=>{
                            if(err){
                                return res.status(500).send({message:"error general"});
                            }else if(userUpdate){
                                return res.send({message: "Envio guardado con exito", envioSaved})
                            }else{
                                return res.status(403).send({message:"No se pudo guardar el registro"});
                            }
                        })
                    }else{
                        return res.status(403).send({message:"No se pudo guardar el registro"});
                    }
                })
            }else{
                return res.status(403).send({message:"No se pudo guardar el registro"});
            }
        })
    }else{
        return res.send({message: "Ingrese los parametros necesarios"});
    }
}

function updateEnvio(req, res){
    var params = req.body;
    var envioId = req.params.id;

    Envio.findByIdAndUpdate(envioId,params,{new:true},(err,updated)=>{
        if(err){
            return res.status(500).send({message:"error general al actualizar",err});
        }else if(updated){
            return res.send({message:"envio actualizado",updated})
        }else{
            return res.status(403).send({message:"no se pudo actualizar el envio, intentalo de nuevo"});
        }
    })
}

function deleteEnvio(req, res){
    var envioId = req.params.id;

    Envio.findByIdAndRemove(envioId, (err, remove)=>{
        if(err){
            return res.status(500).send({message:"error general"});
        }else if(remove){
            return res.send({message: "Envio eliminado", remove});
        }else{
            return res.status(403).send({message:"No se pudo eliminar este envio, intentalo de nuevo"});
        }
    })
}

function getEnvios(req, res){
    var userId = req.params.id;

    User.findById(userId, (err, userFind)=>{
        if(err){
            return res.status(500).send({message:"error general"});
        }else if(userFind){
            return res.send({message: "Envios: ", userFind});
        }else{
            return res.status(403).send({message:"No se encontraron registros"});
        }
    }).populate({path: 'envios', populate:{path:'factura'}});
}

function getEnviosAdmin(req, res){
    Envio.find({},(err,envioFind)=>{
        if(err){
            return res.status(500).send({message:"error general"});
        }else if(envioFind){
            return res.send({message: "Envios: ", envioFind});
        }else{
            return res.status(403).send({message:"No se encontraron registros"});
        }
    }).populate({path: "factura", populate:{path:"detalles", populate:{path:"producto"}}})
}


function getFac(req, res){
    var facId = req.params.id;

    Factura.findById(facId, (err, facFind)=>{
        if(err){
            return res.status(500).send({message:"error general"});
        }else if(facFind){
            return res.send({message: "Facturas: ", facFind});
        }else{
            return res.status(403).send({message:"No se encontraron registros"});
        }
    }).populate({path: 'detalles', populate:{path:'producto'}});
}

module.exports = {
    getEnvios,
    deleteEnvio,
    updateEnvio,
    createEnvio,
    getEnviosAdmin
    getFac
}
