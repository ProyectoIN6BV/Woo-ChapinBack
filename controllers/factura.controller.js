'use strict'


var Factura = require("../models/factura.model");
var Carrito = require("../models/carrito.model");
var Producto = require("../models/producto.model")
var Detalle = require("../models/detalle.model");
var User = require("../models/user.model");
var moment = require("moment");
var mongoose = require("mongoose");


function crearFactura(req,res,next){
    var userId = req.params.userId;
    var params = req.body;
    var factura = new Factura();

    console.log(params)
    if(req.user.sub != userId){
        return res.status(500).send({message:"no tienes permiso para realizar esta acción"});
    }else{
        Carrito.findOne({user:userId},(err,carritoFind)=>{
            if(err){
                return res.status(500).send({message:"error general",err});
            }else if(carritoFind){
                if(carritoFind.total>0){
                    if(params.nit){
                        var x =0;
                        Detalle.find({_id:carritoFind.detalles},(err,detalleFind)=>{
                            if(err){
                                return res.status(500).send({message:"error general en detalle",err});
                            }else if(detalleFind){
                                    var x=0;
                                   detalleFind.forEach(function(detallesFind){
                                        
                                        if(x!=detalleFind.length){
                                            Producto.findById(detallesFind.producto,(err,productoFind)=>{
                                                if(err){
                                                    console.log("error general",err);
                                                }else if(productoFind){
                                                    var stockT = productoFind.stock-(detallesFind.cantidad*1);
                                                    var vendidosT = productoFind.cantidadVendida+(detallesFind.cantidad*1);
                                                    if(stockT>=0){
                                                        Producto.findByIdAndUpdate(productoFind._id,{stock:stockT,cantidadVendida:vendidosT},{new:true},(err,productoUpdated)=>{
                                                            if(err){
                                                                return res.status(500).send({message:"error general al actualizar stock",err});
                                                            }else if(productoUpdated){
                                                                console.log("stock actualizado");
                                                            }else{
                                                                return res.send({message:"no se ha encontrado los productos"});        
                                                            }
                                                        })
                                                    }else{
                                                        return res.send({message:"el producto no tiene suficiente stock"});  
                                                    }
                                                   
                                                }else{
                                                    return res.send({message:"no se ha encontrado los productos"});
                                                }
                                            })
                                        }
                                        x=x+1;
                                      
                                   })
                                   factura.detalles = carritoFind.detalles;
                                    var now = moment();
                                    now.format("DD/MM/YY")
                                    factura.fecha = now;
                                    factura.total = carritoFind.total;
                                    factura.nit = params.nit;
                                    factura.user = userId;
                                    factura.save((err,facturaSave)=>{
                                        if(err){
                                            return res.status(500).send({message:"error general al crear factura",err});
                                        }else if(facturaSave){
                                            Carrito.findByIdAndRemove(carritoFind._id,(err,carritoDeleted)=>{
                                                if(err){
                                                    return res.status(500).send({message:"error general al vaciar carrito",err});
                                                }else if(carritoDeleted){
                                                    Factura.findById(facturaSave._id,(err,facturaFind)=>{
                                                        if(err){
                                                            return res.status(500).send({message:"error general al buscar factura",err});
                                                        }else if(facturaFind){
                                                            User.findByIdAndUpdate(userId,{$push:{facturas:facturaFind._id}},{new:true},(err,userUpdate)=>{
                                                                    if(err){
                                                                        return res.status(500).send({message:"error general"});
                                                                    }else if(userUpdate){
                                                                        return res.send({message: "Factura guardada con exito", facturaFind})
                                                                    }else{
                                                                        return res.status(403).send({message:"No se pudo guardar la factura"});
                                                                    }
                                                            });
                                                        }else{
                                                            return res.status(403).send({message:"no se encontró la factura intentelo de nuevo"})
                                                        }
                                                    }).populate("detalles")
                                                }else{
                                                    return res.send({message:"El carrito está vacío 2"}); 
                                                }
                                            })
                                        }else{
                                            return res.send({message:"no se ha podido guardar la factura, intentelo de nuevo"});
                                        }
                                    })
                            }else{
                                return res.send({message:"no se ha encontrado los productos del carrito"});
                            }
                        })
                       
                    }else{
                        return res.send({message:"Por favor Ingrese nit"});        
                    }
                    
                }else{
                    return res.send({message:"El carrito está vacío"});    
                }
            }else{
                return res.send({message:"El carrito está vacío"});
            }
        })
    }  
}

function verMisFacturas(req,res){
    var userId = req.params.userId;
    if(req.user.sub != userId){
        return res.status(500).send({message:"no tienes permiso para realizar esta acción"});
    }else{
        Factura.find({user:userId},(err,facturaFind)=>{
            if(err){
                return res.status(500).send({message:"error general al buscar factura",err});
            }else if(facturaFind){
                return res.send({message:"Estas son tus facturas:",facturaFind});
            }else{
                return res.status(403).send({message:"no tienes facturas registradas"});
            }
        }).populate("detalles");
    }
}

function buscarFacturaAdmin(req,res){
    var userId = req.params.userId;
    Factura.find({user:userId},(err,facturaFind)=>{
        if(err){
            return res.status(500).send({message:"error general al buscar factura",err});
        }else if(facturaFind){
            return res.send({message:"Estas son tus facturas:",facturaFind});
        }else{
            return res.status(403).send({message:"no tienes facturas registradas"});
        }
    }).populate("detalles");
}

function BuscarFacturaProducto(req,res){
    var facturaId = req.params.facturaId;

    Factura.findById(facturaId,(err,facturaFind)=>{
        if(err){
            return res.status(500).send({message:"error general al buscar factura",err});
        }else if(facturaFind){
            Detalle.find({_id:facturaFind.detalles},(err,detalleFind)=>{
                if(err){
                    return res.status(500).send({message:"error general al buscar productos",err});
                }else if(detalleFind){
                    return res.send({message:"Los productos de la factura buscada son:",detalleFind});
                }else{
                    return res.send({message:"no se encontaron productos en la factura"});
                }
            }).populate("producto")
        }else{
            return res.send({message:"no se ha encontrado ni una factura registrada"});
        }
    })
}

function getFacturasAdmin(req,res){
    Factura.find({},(err,facturaFind)=>{
        if(err){
            return res.status(500).send({message:"error general al buscar factura",err});
        }else if(facturaFind){
            return res.send({message:"Estas son las facturas registradas:",facturaFind});
        }else{
            return res.status(403).send({message:"no tienes facturas registradas"});
        }
    }).populate("detalles");
}

function countPedido(req,res){

    Factura.find({},(err,pedidoCount)=>{
        if(err){
            return res.status(500).send({message:"error general",err});
        }else if(pedidoCount){
            return res.send({message:"Pedidos",pedidoCount});
        }else{
            return res.send({message:"no hay pedidos registrados", pedidoCount:0});
        }
    }).count();
}

function totalVendido(req,res){
    let facLength = "";
    let sum = 0;

    Factura.find({},(err,pedidoCount)=>{
        if(err){
            return res.status(500).send({message:"error general",err});
        }else if(pedidoCount){

            facLength = Object.keys(pedidoCount).length;
            for (let i = 0; i < facLength; i++){
                sum = Number.parseInt(pedidoCount[i].total) + sum;
            }
            
            return res.send({message: "Total vendido", sum})
        }else{
            return res.send({message:"no hay pedidos registrados"});
        }
    });
}

module.exports={
    crearFactura,
    verMisFacturas,
    buscarFacturaAdmin,
    BuscarFacturaProducto,
    getFacturasAdmin,
    countPedido,
    totalVendido
}