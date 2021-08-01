'use strict'


var Carousel = require("../models/carousel.model");
var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path")

function createCarouselDefault(req,res){
    var nameC= "Carousel";
    var carousel = new Carousel();

    Carousel.findOne({name: nameC},(err,carouselFind)=>{
        if(err){
            console.log("error general",err);
        }else if(carouselFind){
            console.log("carousel ya existe");
        }else{
            carousel.name = nameC;
            carousel.images[0]={
                image: "carousel.jpg"
            }
            carousel.images[1]={
                image: "carousel1.jpg"
            }
            carousel.images[2]={
                image: "carousel2.jpg"
            }
            carousel.save((err,carouselSaved)=>{
                if(err){
                    console.log("error general al guardar",err);
                }else if(carouselSaved){
                    console.log("Carousel creado");
                }else{
                    console.log("no se pudo guardar el usuario");
                }
            })
        }
    })
}

function getImageName(req,res){
    var nameC= "Carousel";
    var carousel = new Carousel();

    Carousel.findOne({name: nameC},(err,carouselFind)=>{
        if(err){
            return res.status(500).send({message:"Error General",err});  
        }else if(carouselFind){
            return res.send({message:"carousel encontrado",carouselFind});  
        }else{
            return res.send({message:"no se encontró carousel"});  
        }
    })
}

function uploadImgCarousel(req, res){
    var carouselId = req.params.id;
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
                    Carousel.findByIdAndUpdate(carouselId, {$push:{images:{image: fileName}}}, {new:true}, (err, hotelUpdate)=>{
                        if(err){
                            return res.status(500).send({hotel: hotelUpdate});
                        }else if(hotelUpdate){
                            return res.send({hotel: hotelUpdate, hotelImage: hotelUpdate.images});
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

function getImageCarousel(req, res){

    var fileName = req.params.fileName;
    var pathFile = './uploads/carousel/' + fileName;
        fs.exists(pathFile, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(pathFile))
        }else{
           return res.status(404).send({message: 'Imagen inexistente'});
        }
    }) 
}

function deleteImgCarousel(req,res){
    var carouselId = req.params.id;
    var carousel = new Carousel();

    Carousel.findOne({name: "Carousel"}, (err, carouselFind)=>{
        if(err){
            return res.status(500).send({message:"Error General",err});  
        }else if(carouselFind){
            Carousel.findByIdAndRemove(carouselFind._id, (err, carouselRemove)=>{
                if(err){
                    return res.status(500).send({message:"Error General",err});
                }else if(carouselRemove){
                    carousel.name = "Carousel";
        
                    carousel.save((err, carouselSaved)=>{
                        if(err){
                            return res.status(500).send({message:"Error General",err});
                        }else if(carouselSaved){
                            return res.send({message: "Imagenes eliminadas exitosamente"});
                        }else{
                            return res.status(403).send({message:"No se han podido guardar este registro"});
                        }
                    })
                }else{
                    return res.status(403).send({message:"No se han encontrado registros"});
                }
            })
        }else{
            return res.status(403).send({message:"No se han encontrado registros"});
        }
    })
}


function delteAndUpdate(req, res){
    var carouselId = req.params.id;
    var fileNameOne = req.params.img;

    Carousel.findByIdAndUpdate(carouselId, {$pull:{images:{image: fileNameOne}}}, {new:true}, (err, deleteImg)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(deleteImg){
            if(req.files){
                var fileName = 'Sin imagen';

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
                        Carousel.findByIdAndUpdate(carouselId, {$push:{images:{image: fileName}}}, {new:true}, (err, imgUpdate)=>{
                            if(err){
                                return res.status(500).send({hotel: imgUpdate});
                            }else if(imgUpdate){
                                return res.send({hotel: imgUpdate, imgUpdate: imgUpdate.images});
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
        }else{
            return res.status(404).send({message: 'No se actualizó'});
        }
    })
}


module.exports = {
    uploadImgCarousel,
    getImageCarousel,
    deleteImgCarousel,
    createCarouselDefault,
    getImageName,
    delteAndUpdate
}
