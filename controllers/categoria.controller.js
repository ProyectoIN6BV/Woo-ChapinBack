'use strict'


var Categoria = require("../models/categoria.model");
var Producto = require("../models/producto.model");

function createCategoryDefault(req,res){
   var nameCategory = "DEFAULT";
   var descCategory = "CATEGORÍA POR DEFAULT";
   var categoria = new Categoria();
   Categoria.findOne({nameCategoria: nameCategory},(err,categoryFind)=>{
    if(err){
        console.log("error al buscar",err);
    }else if(categoryFind){
        console.log("categoría por default creada");
    }else{
        categoria.nameCategoria = nameCategory;
        categoria.descCategoria = descCategory;
        categoria.save((err,categoriaSaved)=>{
            if(err){
                console.log("error al guardar",err);
            }else if(categoriaSaved){
                console.log("categoría guardada correctamente");
            }else{
               console.log("No se pudo guardar la categoría");
            }
        })
    }
})
    
}
function createCategory(req,res){
    var params = req.body;
    var categoria = new Categoria();
    
    if(params.nameCategoria && params.descCategoria){
        Categoria.findOne({nameCategoria: params.nameCategoria},(err,categoryFind)=>{
            if(err){
                return res.status(500).send({message:"error general al buscar",err});
            }else if(categoryFind){
                return res.send({message:"esta categoría ya esta en uso"});
            }else{
                categoria.nameCategoria = params.nameCategoria;
                categoria.descCategoria = params.descCategoria;
                categoria.save((err,categoriaSaved)=>{
                    if(err){
                        return res.status(500).send({message:"error general",err});
                    }else if(categoriaSaved){
                        return res.send({message:"categoría guardada correctamente",categoriaSaved});
                    }else{
                        return res.status(403).send({message:"No se pudo guardar la categoría"});
                    }
                })
            }
        })
    }else{
        return res.send({message:"Ingresa los campos mínimos"});
    }
}

function getCategory(req,res){
    Categoria.find({},(err,categories)=>{
        if(err){
            return res.status(500).send({message:"error general al buscar",err});
        }else if(categories){
            return res.send({message:"Categorías encontradas:",categories});
        }else{
            return res.send({message:"no se ha encontrado categorías registradas"});
        }
    })
}

function updateCategory(req,res){
    var params = req.body;
    var categoryId = req.params.categoryId;
    if(params.nameCategoria){
        Categoria.findOne({nameCategoria: params.nameCategoria},(err,categoryFind)=>{
            if(err){
                return res.status(500).send({message:"error al buscar"});
            }else if(categoryFind){
                return res.send({message:"Nombre de categoría en uso:",categoryFind});
            }else{
                Categoria.findByIdAndUpdate(categoryId,params,{new:true},(err,updated)=>{
                    if(err){
                        return res.status(500).send({message:"error general al actualizar",err});
                    }else if(updated){
                        return res.send({message:"Categoría actualizada:",updated})
                    }else{
                        return res.send({message:"no se ha podido actualizar intentelo de nuevo"});
                    }
                });
            }
        });
    }else{
        Categoria.findByIdAndUpdate(categoryId,params,{new:true},(err,updated)=>{
            if(err){
                return res.status(500).send({message:"error general al actualizar",err});
            }else if(updated){
                return res.send({message:"Categoría actualizada:",updated})
            }else{
                return res.send({message:"no se ha podido actualizar intentelo de nuevo"});
            }
        });
    }

}

function deleteCategory(req,res){
    var categoryId = req.params.categoryId;
    Categoria.findById(categoryId,(err,categoryFind)=>{
        if(err){
            return res.status(500).send({message:"error general al buscar",err});
        }else if(categoryFind){
            Categoria.findOne({nameCategoria:"DEFAULT"},(err,categoryFind2)=>{
                if(err){
                    return res.status(500).send({message:"error general al buscar 2",err});
                }else if(categoryFind2){
                    Producto.findOne({categoria:categoryId},(err,productosFind)=>{
                        if(err){
                            return res.status(500).send({message:"error general al buscar 2",err});
                        }else if(productosFind){
                            Producto.update({categoria:categoryId},{categoria:categoryFind2._id},{new:true},(err,productoUpdated)=>{
                                if(err){
                                    return res.status(500).send({message:"error general al actualizar",err});
                                }else if(productoUpdated){
                                    Categoria.findByIdAndRemove(categoryId,(err,categoryDeleted)=>{
                                        if(err){
                                            return res.status(500).send({message:"error general al eliminar",err});
                                        }else if(categoryDeleted){
                                            return res.send({message:"categoría eliminada exitosamente, se han actualizado estos productos:",productoUpdated});
                                        }else{
                                            return res.send({message:"no se ha encontrado la categoría para eliminar"});
                                        }
                                    });
                                }else{
                                   return res.send({message:"no se pudo actualizar los productos"});
                                }
                            })
                        }else{
                            Categoria.findByIdAndRemove(categoryId,(err,categoryDeleted)=>{
                                if(err){
                                    return res.status(500).send({message:"error general al eliminar",err});
                                }else if(categoryDeleted){
                                    return res.send({message:"categoría eliminada exitosamente, no se encontrar productos que actualizar"});
                                }else{
                                    return res.send({message:"no se ha encontrado la categoría para eliminar"});
                                }
                            });
                        }
                    })
                   
                }else{
                    return res.send({message:"no se encontró la categoría por defecto"});
                }
            })
        }else{
            return res.status(403).send({message:"No se ha encontrado la categoría"});
        }
    })
}

module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    createCategoryDefault,
    deleteCategory
}