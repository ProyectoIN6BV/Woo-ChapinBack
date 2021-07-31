'use strict'


var Carrito = require("../models/carrito.model");
var Producto = require("../models/producto.model");
var Detalle = require("../models/detalle.model");
var mongoose = require("mongoose");

function AgregarCarrito(req, res){
    var userId = req.params.userId;
    var productId = req.params.productId;
    var params = req.body;
    
    var detalle = new Detalle();
    var carrito = new Carrito();
    Producto.findById(productId,(err,productoFindV)=>{
        if(err){
            return res.status(500).send({Message:"error general",err});
        }else if(productoFindV){
            if(productoFindV.stock > 0){
                if(req.user.sub != userId){
                    return res.status(500).send({Message:"No tienes permiso para realizar esta acción"});
                }else{
                    Carrito.findOne({user:userId},(err,carritoFind)=>{
                        if(err){
                            return res.status(500).send({Message:"error general",err});
                        }else if(carritoFind){
                           Producto.findById(productId,(err,productoFind)=>{
                               if(err){
                                    return res.status(500).send({Message:"error general",err});
                               }else if(productoFind){
                                    Detalle.findOne({_id:carritoFind.detalles,producto:productoFind._id},(err,detalleFind)=>{
                                        if(err){
                                            return res.status(500).send({Message:"error general",err});
                                        }else if(detalleFind){
                                            var params2={
                                                cantidad: detalleFind.cantidad+(params.cantidad*1),
                                                subTotal: productoFind.precio*( detalleFind.cantidad+(params.cantidad*1))
                                            }
                                            Detalle.findByIdAndUpdate(detalleFind._id,params2,{new:true},(err,detalleupdated)=>{
                                                if(err){
                                                    return res.status(500).send({Message:"error general",err});
                                                }else if(detalleupdated){
                                                    var carritoupdate ={
                                                        total: carritoFind.total+(params.cantidad*productoFind.precio)
                                                    }
                                                    Carrito.findByIdAndUpdate(carritoFind._id,carritoupdate,{new:true},(err,carritoUp)=>{
                                                        if(err){
                                                            return res.status(500).send({Message:"error general",err});
                                                        }else if(carritoUp){
                                                            return res.send({message:"carrito actualizado",carritoUp});
                                                        }else{
                                                            return res.send({message:"no se ha encontrado el carrito"});
                                                        }
                                                    }).populate("detalles");
                                                }else{
                                                    return res.send({message:"no se ha encontrado el detalle"})
                                                }
                                            })
                                            
                                        }else{
                                           Producto.findById(productId,(err,productofind2)=>{
                                                if(err){
                                                    return res.status(500).send({message:"error general"});
                                                }else if(productofind2){
                                                    detalle.cantidad = params.cantidad;
                                                    detalle.subTotal = params.cantidad*(productofind2.precio);
                                                    detalle.producto = productofind2._id;
                                                    detalle.save((err,detalleSaved)=>{
                                                        if(err){
                                                            return res.status(500).send({message:"error general",err});
                                                        }else if(detalleSaved){
                                                            var params3 = {
                                                                total: carritoFind.total+(detalleSaved.subTotal*1)
                                                            }
                                                            Carrito.findByIdAndUpdate(carritoFind._id,{$push:{detalles:detalleSaved._id},total:params3.total},{new:true},(err,carritoUpdated)=>{
                                                                if(err){
                                                                    return res.status(500).send({message:"error general",err});
                                                                }else if(carritoUpdated){
                                                                    return res.send({message:"el carrito se ha actualizado correctamente:",carritoUpdated});
                                                                }else{
                                                                    return res.send({message:"no se ha encontrado el carrito"});
                                                                }
                                                            }).populate("detalles");
                                                        }else{
                                                            return res.send({message:"no se ha podido guardar el detalle"});
                                                        }
                                                    })
                                                }else{
                                                    return res.send({message:"no se ha encontrado el producto"});
                                                }
                                           })
                                        }
                                    })
                               }else{
                                   return res.send({message:"no se ha encontrado el producto"});
                               }
                           })
                        }else{
                            Producto.findById(productId,(err,productoFind3)=>{
                                if(err){
                                    return res.status(500).send({message:"error general al buscar producto",err});
                                }else if(productoFind3){
                                    detalle.producto = productId;
                                    detalle.cantidad = params.cantidad;
                                    detalle.subTotal = params.cantidad*(productoFind3.precio);
                                    detalle.save((err,detalleSaved2)=>{
                                        if(err){
                                            return res.status(500).send({message:"error general al guardar producto",err});
                                        }else if(detalleSaved2){
                                            carrito.detalles = detalleSaved2._id;
                                            carrito.total = detalle.subTotal;
                                            carrito.user = userId;
                                            carrito.save((err,carritoSaved)=>{
                                                if(err){
                                                    return res.status(500).send({message:"error general al crear carrito",err});
                                                }else if(carritoSaved){
                                                    Carrito.findById(carritoSaved._id,(err,carritoFind2)=>{
                                                        if(err){
                                                            return res.status(500).send({message:"error general al buscar", err});
                                                        }else if(carritoFind2){
                                                            return res.send({message:"carrito creado exitosamente",carritoFind2});
                                                        }else{
                                                            return res.send({message:"no se ha podido mostrar el carrito"});
                                                        }
                                                    }).populate("detalles")
                                                }else{
                                                    return res.send({message:"no se ha podido guardar el carrito"});
                                                }
                                            })
                                        }else{
                                            return res.send({message:"no se ha podido guardar el detalle"});
                                        }
                                    })
                                }else{
                                    return res.send({message:"no se ha encontrado el producto"});
                                }
                            })
            
                        }
                    })
                }
            }else{
                return res.send({message:"no tiene suficiente stock"});
            }
        }else{
            return res.send({message:"no se encontró el producto"});
        }
    })
    

}

function  eliminarProductoCarrito(req,res){
    var userId = req.params.userId;
    var productId = req.params.productId;

    if(req.user.sub != userId){
        return res.status(500).send({Message:"No tienes permiso para realizar esta acción"});
    }else{
        Carrito.findOne({user:userId},(err,carritoFind)=>{
            if(err){
                return res.status(500).send({message:"error general al buscar carrito",err});
            }else if(carritoFind){
                Detalle.findOne({_id:carritoFind.detalles,producto:productId},(err,detalleFind)=>{
                    if(err){
                        return res.status(500).send({message:"error general al buscar detalle",err});
                    }else if(detalleFind){
                        var cantidadRest = (detalleFind.cantidad*1)-1;
                        if(cantidadRest<0){
                            return res.send({message:"ya no se encuentra el producto"});
                        }else if(cantidadRest==0){
                            var totalT = carritoFind.total-(detalleFind.subTotal*1);
                            Carrito.findByIdAndUpdate(carritoFind._id,{$pull:{detalles:detalleFind._id},total:totalT},{new:true},(err,carritoDeleted)=>{
                                if(err){
                                    return res.status(500).send({message:"error general al eliminar",err});
                                }else if(carritoDeleted){
                                    Detalle.findByIdAndRemove(detalleFind._id,(err,detalleDeleted)=>{
                                        if(err){
                                            return res.status(500).send({message:"error general al eliminar detalle",err});
                                        }else if(detalleDeleted){
                                            return res.send({message:"producto eliminado correctamente",carritoDeleted})
                                        }else{
                                            return res.status(403).send({message:"no se ha podido encontrar detalle de carrito"});
                                        }
                                    })
                                }else{
                                    return res.send({message:"no se ha podido encontrar el carrito"});
                                }
                            }).populate("detalles")
                        }else if(cantidadRest>0){
                            Producto.findById(productId,(err,productoFind)=>{
                                if(err){
                                    return res.status(500).send({message:"error general al buscar producto",err});
                                }else if(productoFind){
                                    var totalT = carritoFind.total-(productoFind.precio*1);
                                    Carrito.findByIdAndUpdate(carritoFind._id,{total:totalT},{new:true},(err,carritoUpdated)=>{
                                        if(err){
                                            return res.status(500).send({message:"error general",err});
                                        }else if(carritoUpdated){
                                            var params2 ={
                                                cantidad: (detalleFind.cantidad*1)-1,
                                                subTotal : (detalleFind.subTotal*1)-productoFind.precio
                                            }
                                            
                                            Detalle.findByIdAndUpdate(detalleFind._id,params2,{new:true},(err,detalleUpdated2)=>{
                                                if(err){
                                                    return res.status(500).send({message:"error general",err});
                                                }else if(detalleUpdated2){
                                                   Carrito.findById(carritoFind._id,(err,carritoFind3)=>{
                                                        if(err){
                                                            return res.status(500).send({message:"error general",err});
                                                        }else if(carritoFind3){
                                                            return res.send({message:"carrito actualizado:",carritoFind3})
                                                        }else{
                                                            return res.send({message:"carrito no encontrado"});                
                                                        }
                                                   }).populate("detalles");
                                                }else{
                                                    return res.send({message:"no se pudo actualizar la cantidad de productos"});
                                                }
                                            })
                                        }else{
                                            return res.send({message:"carrito no encontrado"});
                                        }
                                    })
                                }else{
                                    return res.status(403).send({message:"no se ha podido encontrar el producto"});            
                                }
                            })
                        }
                    }else{
                        return res.status(403).send({message:"no se ha podido encontrar el producto en el carrito"});
                    }
                })
            }else{
                return res.send({message:"no se ha podido encontrar el carrito"});
            }
        })
    }
}


function eliminarDetalle(req,res){
    var userId = req.params.userId;
    var productId = req.params.productId;
    if(req.user.sub != userId){
        return res.status(500).send({Message:"No tienes permiso para realizar esta acción"});
    }else{
        Carrito.findOne({user:userId},(err,carritoFind)=>{
            if(err){
                return res.status(500).send({message:"error general al buscar carrito",err});
            }else if(carritoFind){
                Detalle.findOne({_id:carritoFind.detalles,producto:productId},(err,detalleFind)=>{
                    if(err){
                        return res.status(500).send({message:"error general al buscar los productos del carrito",err});
                    }else if(detalleFind){
                        var totalT = carritoFind.total-(detalleFind.subTotal*1);
                        Carrito.findByIdAndUpdate(carritoFind._id,{$pull:{detalles:detalleFind._id},total:totalT},{new:true},(err,carritoDeleted)=>{
                            if(err){
                                return res.status(500).send({message:"error general al eliminar",err});
                            }else if(carritoDeleted){
                                Detalle.findByIdAndRemove(detalleFind._id,(err,detalleDeleted)=>{
                                    if(err){
                                        return res.status(500).send({message:"error general al eliminar detalle",err});
                                    }else if(detalleDeleted){
                                        return res.send({message:"producto eliminado correctamente",carritoDeleted})
                                    }else{
                                        return res.status(403).send({message:"no se ha podido encontrar detalle de carrito"});
                                    }
                                })
                            }else{
                                return res.send({message:"no se ha podido encontrar el carrito"});
                            }
                        }).populate("detalles")
                    }else{
                        return res.send({message:"No se ha encontrado este producto en el carrito"});
                    }
                })
            }else{
                return res.send({message:"el carrito está vacío"});
            }
        })
    }
}


function viewCarrito(req,res){
    var userId = req.params.userId;
    if(req.user.sub!=userId){
        return res.status(500).send({message:"No tienes permiso para realizar esta acción"});
    }else{
        Carrito.findOne({user:userId},(err,carritoFind)=>{
            if(err){
                return res.status(500).send({message:"error general al buscar carrito",err});
            }else if(carritoFind){
                return res.send({message:"El carrito tiene lo siguiente:",carritoFind});
            }else{
                return res.send({message:"el carrito está vacío"});
            }
        }).populate({path: "detalles", populate:{path:"producto"}})
    }
}
module.exports = {
    AgregarCarrito,
    eliminarProductoCarrito, // esta función elimina 1 unidad de producto que se haya agregado en la cantidad
    eliminarDetalle,
    viewCarrito
}
