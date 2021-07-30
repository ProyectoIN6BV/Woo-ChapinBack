'use strict'


var Producto = require("../models/producto.model");
var Categoria = require("../models/categoria.model");
var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");


function createProduct(req,res){
    var params = req.body;
    var producto = new Producto();
    if(params.nameProducto && params.precio && params.stock && params.categoria){
        Producto.findOne({nameProducto: params.nameProducto},(err,productFind)=>{
            if(err){
                return res.status(500).send({message:"error general al buscar",err});
            }else if(productFind){
                return res.send({message:"Este producto ya existe", productFind});
            }else{
                producto.nameProducto = params.nameProducto;
                producto.descProducto = params.descProducto;
                producto.precio = params.precio;
                producto.stock = params.stock;
                producto.categoria = params.categoria;
                producto.cantidadVendida = 0;
                producto.tags = params.tags;
                producto.save((err,productoSaved)=>{
                    if(err){
                        return res.status(500).send({message:"error general al guardar", err});
                    }else if(productoSaved){
                        return res.send({message:"producto guardado",productoSaved});
                    }else{
                        return res.status(403).send({message:"no se pudo guardar el producto, intentalo de nuevo"});
                    }
                })
            }
        })
    }else{
        return res.send({message:"ingrese los campos mínimos"});
    }
}

function getProducts(req,res){
    Producto.find({},(err,productosFind)=>{
        if(err){
            return res.status(500).send({message:"error general",err});
        }else if(productosFind){
            return res.send({message: "Productos encontrados:",productosFind});
        }else{
            return res.send({message:"No se ha encontrado ningún producto"});
        }
    })
}

function searchproduct(req,res){
    var params = req.body;
    var ObjectId =mongoose.Types.ObjectId;
    var object = new ObjectId((params.search.length<24)? "000000000000000000000000": params.search);
    if(params.search){
        Categoria.findOne({nameCategoria:params.search},(err,categoriaFind)=>{
            if(err){
                return res.status(500).send({message:"error general al buscar", err});
            }else if(categoriaFind){
                Producto.find({categoria:categoriaFind._id},(err,productosFind)=>{
                    if(err){
                        return res.status(500).send({message:"error general al buscar", err});
                    }else if(productosFind){
                        return res.send({message:"productos encontrados:", productosFind});
                    }else{
                        return res.send({message:"no se encontró ningún producto registrado"});
                    }
                }).populate("categoria")
            }else{
                Producto.find({$or:[{nameProducto: params.search},{_id:object}]},(err,productosFind)=>{
                    if(err){
                        return res.status(500).send({message:"error general al buscar", err});
                    }else if(productosFind){
                        return res.send({message:"productos encontrados:", productosFind});
                    }else{
                        return res.send({message:"no se encontró ningún producto registrado"});
                    }
                }).populate("categoria");
            }
        })
    }else{
        return res.status(403).send({message:"ingrese un valor de busqueda"});
    }
}
function updateProduct(req,res){
    var params = req.body;
    var productId = req.params.productId;
    
        if(params.nameProducto){
            Producto.findOne({nameProducto:params.nameProducto},(err,productoFind)=>{
                if(err){
                    return res.status(500).send({message:"error general al buscar",err});
                }else if(productoFind){
                    if(productoFind.nameProducto == params.nameProducto && productoFind._id == params._id){
                        Producto.findByIdAndUpdate(productId,params,{new:true},(err,updated)=>{
                            if(err){
                                return res.status(500).send({message:"error general al actualizar",err});
                            }else if(updated){
                                return res.send({message:"producto actualizado",updated})
                            }else{
                                return res.status(403).send({message:"no se pudo actualizar el producto, intentalo de nuevo"});
                            }
                        })
                    }else{
                        return res.send({message:"este nombre de producto ya está en uso"});
                    }
                }else{
                    Producto.findByIdAndUpdate(productId,params,{new:true},(err,updated)=>{
                        if(err){
                            return res.status(500).send({message:"error general al actualizar",err});
                        }else if(updated){
                            return res.send({message:"producto actualizado",updated})
                        }else{
                            return res.status(403).send({message:"no se pudo actualizar el producto, intentalo de nuevo"});
                        }
                    })
                }
            })
        }else{
            Producto.findByIdAndUpdate(productId,params,{new:true},(err,updated)=>{
                if(err){
                    return res.status(500).send({message:"error general al actualizar",err});
                }else if(updated){
                    return res.send({message:"producto actualizado",updated})
                }else{
                    return res.status(403).send({message:"no se pudo actualizar el producto, intentalo de nuevo"});
                }
            })
        }
    
    
}

function updateStock(req,res){
    var params = req.body;
    var productId = req.params.productId;
    if(params.stock){
        if(params.stock<0){
            return res.send({message:"el stock no puede ser menor a 0"});
        }else{
            Producto.findByIdAndUpdate(productId,params,{new:true},(err,updated)=>{
                if(err){
                    return res.status(500).send({message:"error general",err});
                }else if(updated){
                    return res.send({message:"stock actualizado", updated});
                }else{
                    return res.send({message:"no se ha encontrado el producto"});
                }
            })
        }
    }else{
        return res.send({message:"ingresa los campos mínimos"});
    }
}
function viewStock(req,res){
    var productId = req.params.productId;
    Producto.findById(productId,(err,productFind)=>{
        if(err){
            return res.status(500).send({message:"error general",err});
        }else if(productFind){
            var stockTotal = productFind.stock;
            return res.send({message:"el stock del producto es:", stockTotal });
        }else{
            return res.send({message:"No se ha encontrado el producto"});
        }
    });
}


function viewProductsBest(req,res){
    Producto.find({},(err,productosFind)=>{
        if(err){
            return res.status(500).send({message:"error general al ver Productos",err});
        }else if(productosFind){
            return res.send({message:"Los productos más vendidos son:",productosFind});
        }else{
            return res.status(403).send({message:"No hay ningún producto registrado"});
        }
    }).sort({cantidadVendida:-1}).populate("categoria").limit(6);
}

function viewNewProduct(req,res){
    Producto.find({},(err,productosFind)=>{
        if(err){
            return res.status(500).send({message:"error general al ver Productos",err});
        }else if(productosFind){
            return res.send({message:"Los productos más vendidos son:",productosFind});
        }else{
            return res.status(403).send({message:"No hay ningún producto registrado"});
        }
    }).sort({ "_id": -1}).limit(6).populate("categoria");
}


function viewproductsAgotados(req,res){
    Producto.find({stock:0},(err,productosFind)=>{
        if(err){
            return res.status(500).send({message:"error general al ver Productos",err});
        }else if(productosFind){
            return res.send({message:"Los productos agotados son:",productosFind});
        }else{
            return res.status(403).send({message:"No hay ningún producto registrado"});
        }
    })
}

function deleteProduct(req,res){
    var productId = req.params.productId;
    Producto.findByIdAndRemove(productId,(err,productDeleted)=>{
        if(err){
            return res.status(500).send({message:"error general al eliminar producto"});
        }else if(productDeleted){
            return res.send({message:"producto eliminado:",productDeleted});
        }else{
            return res.send({message:"no se ha podido encontrar el producto"});
        }
    })
}

function uploadImgProd(req, res){    
    console.log("hola imagen")
    var prodId = req.params.id;
    var fileName = 'Sin imagen';

        if(req.files){
            //captura la ruta de la imagen
            var filePath = req.files.image.path;
            //separa en indices cada carpeta
            //si se trabaja en linux ('\');
            var fileSplit = filePath.split('\\');
            //captura el nombre de la imagen
            var fileName = fileSplit[2];

            var ext = fileName.split('\.');
            var fileExt = ext[1];

            if( fileExt == 'png' ||
                fileExt == 'jpg' ||
                fileExt == 'jpeg' ||
                fileExt == 'gif'){
                    Producto.findByIdAndUpdate(prodId, {imgProducto: fileName}, {new:true}, (err, prodUpdate)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(prodUpdate){
                            return res.send({producto: prodUpdate, imgProd: prodUpdate.prodUpdate});
                        }else{
                            return res.status(404).send({message: 'No se actualizó'});
                        }
                    })
                }else{
                    fs.unlink(filePath, (err)=>{
                        if(err){
                            return res.status(500).send({message: 'Error al eliminar y la extensión no es válida'});
                        }else{
                            return res.status(403).send({message: 'Extensión no válida, y archivo eliminado'});
                        }
                    })
                }
        }else{
            return res.status(404).send({message: 'No has subido una imagen'});
        }
}

function getImgProd(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/producto/' + fileName;
    fs.exists(pathFile, (exists)=>{
        if(exists){                    
            return res.sendFile(path.resolve(pathFile))
        }else{
           return res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}

module.exports = {
    createProduct,
    getProducts,
    searchproduct,
    updateProduct,
    updateStock,
    viewStock,
    viewProductsBest,
    viewproductsAgotados,
    deleteProduct,
    uploadImgProd,
    getImgProd,
    viewNewProduct
}

