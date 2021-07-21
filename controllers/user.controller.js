'use strict'

var User = require("../models/user.model");

var bcrypt = require("bcrypt-nodejs");

var jwt = require("../services/jwt");
const { param } = require("../routes/user.route");

function createInit(req,res){
    var adminName= 'Admin';
    var adminUserName = 'Admin';
    var adminPassword = '12345';
    var adminRole = 'ROLE_ADMIN';
    var user = new User();
    User.findOne({userName: adminUserName},(err,userFind)=>{
        if(err){
            console.log("error general",err);
        }else if(userFind){
            console.log("usuario ya existe, Usuario:Admin, password:12345");
        }else{
            bcrypt.hash(adminPassword,null,null,(err, passwordHash)=>{
                if(err){
                    console.log("error general al encriptar",err);
                }else if(passwordHash){
                    user.name = adminName;
                    user.userName = adminUserName;
                    user.password= passwordHash;
                    user.role = adminRole;
                    user.save((err,userSaved)=>{
                        if(err){
                            console.log("error general al guardar",err);
                        }else if(userSaved){
                            console.log("usuario creado, Usuario:Admin, password:12345");
                        }else{
                            console.log("no se pudo guardar el usuario");
                        }
                    })
                }else{
                    console.log("no se pudo encriptar");
                }
            })
        }
    })
}


function login(req,res){
    var params = req.body;
    if(params.userName && params.password){
        User.findOne({userName: params.userName},(err,userFind)=>{
            if(err){
                return res.status(500).send({message:"error general",err});
            }else if(userFind){
                bcrypt.compare(params.password,userFind.password,(err,passwordCheck)=>{
                    if(err){
                        return res.status(500).send({message:"error general al comparar", err});
                    }else if(passwordCheck){
                        if(params.getToken){
                            return res.send({token: jwt.createToken(userFind)});
                        }else{
                            return res.send({message:"usuario logueado, para obtener el token, ingrese el campo getToken"});
                        }
                    }else{
                        return res.send({message:"contraseña incorrecta"});        
                    }
                })
            }else{
                return res.send({message:"Usuario No encontrado"});
            }
        });
    }else{
        return res.status(403).send({message:"Ingrese los campos mínimos"});
    }
}
function createUsuario(req,res){
    var params = req.body;
    var user = new User();
    var roleCliente = "ROLE_CLIENTE";
    if(params.name && params.userName && params.password && params.email && params.email){
        User.findOne({userName: params.userName},(err,userFind)=>{
            if(err){
                return res.status(500).send({message:"error general",err});
            }else if(userFind){
                return res.send({message:"El usuario ya se encuentra en uso"});
            }else{
                bcrypt.hash(params.password,null,null,(err,passwordHash)=>{
                    if(err){
                        return res.status(500).send({message:"Error general", err});
                    }else if(passwordHash){
                        user.name = params.name;
                        user.lastName = params.lastName;
                        user.userName = params.userName;
                        user.password = passwordHash;
                        user.email = params.email;
                        user.phone = params.phone;
                        user.role = roleCliente;
                        user.save((err,userSaved)=>{
                            if(err){
                                return res.status(500).send({message:"error general",err});
                            }else if(userSaved){
                                return res.send({message: "Usuario Creado Exitosamente",userSaved});
                            }else{
                                return res.status(403).send({message:"no se pudo guardar el usuario"});
                            }
                        })
                    }else{
                        return res.send({message:"no se pudo encriptar la contraseña"});
                    }
                })
            }
        })
    }else{
        return res.send({message:"Ingrese los campos mínimos"});
    }
}


function modifyRole(req,res){
    var params = req.body;
    var userId = req.params.userId;
    if(params.role){
        if(params.role == "ROLE_ADMIN" || params.role =="ROLE_CLIENTE"){
            User.findByIdAndUpdate(userId,params,{new:true},(err,updated)=>{
                if(err){
                    return res.status(500).send({message:"error general",err});
                }else if(updated){
                    return res.send({message:"se ha actualizado el rol del usuario:", updated});
                }else{
                    return res.send({message: "No se ha encontrado el usuario"});
                }
            })
        }else{
            return res.send({message:"Ingesa un role valido (ROLE_ADMIN, ROLE_CLIENTE)"});
        }
    }else{
        return res.send({message: "ingresa los campos mínimos"});
    }

}



function deleteUser(req,res){
    var userId = req.params.userId;
    var params = req.body;
    if(req.user.sub != userId){
        return res.status(500).send({message:"no tienes permiso para realizar esta acción"});
    }else{
        if(params.password){
            User.findById(userId,(err,userFind)=>{
                if(err){
                    return res.status(500).send({message:"error general al buscar",err});
                }else if(userFind){
                    bcrypt.compare(params.password,userFind.password,(err,passwordCheck)=>{
                        if(err){
                            return res.status(500).send({message:"error general al comparar",err});
                        }else if(passwordCheck){
                            User.findOneAndRemove({_id:userId},(err,userDeleted)=>{
                                if(err){
                                    return res.status(500).send({message:"error general al eliminar", err});
                                }else if(userDeleted){
                                    return res.send({message:"Usuario eliminado exitosamente",userDeleted});
                                }else{
                                    return res.status(403).send({message:"este usuario ya fue eliminado o no existe"});
                                }
                            })
                        }else{
                            return res.send({message:"contraseña incorrecta"});
                        }
                    })
                }else{

                }
            })
            
        }else{
            return res.status(500).send({message:"debes de ingresar tu contraseña para poder eliminar tu cuenta"});
        }
       
    }
   
}

function modifyUser(req,res){
    var userId = req.params.userId;
    var params = req.body;
    if(req.user.sub != userId){
        return res.status(500).send({message:"no tienes permiso para realizar esta acción"});
    }else{
        if(params.password){
            return res.send({message:"no puedes modificar la contraseña"});
        }else if(params.role){
            return res.send({message:"no tienes permiso para modificar el role"});
        }else{
            if(params.userName){
                User.findOne({userName: params.userName},(err,userFind)=>{
                    if(err){
                        return res.status(500).send({mesage:"error general al buscar usuario"});
                    }else if(userFind){
                        return res.send({message:"este usuario ya esta en uso"});
                    }else{
                        User.findByIdAndUpdate(userId,params,{new:true},(err,userUpdated)=>{
                            if(err){
                                return res.status(500).send({message:"error general al actualizar",err})
                            }else if(userUpdated){
                                return res.send({message:"usuario actualizado",userUpdated});
                            }else{
                                return res.status(403).send({message:"usuario no encontrado"});
                            }
                        })
                    }
                })
            }else{
                User.findByIdAndUpdate(userId,params,{new:true},(err,userUpdated)=>{
                    if(err){
                        return res.status(500).send({message:"error general al actualizar",err})
                    }else if(userUpdated){
                        return res.send({message:"usuario actualizado",userUpdated});
                    }else{
                        return res.status(403).send({message:"usuario no encontrado"});
                    }
                })
            }
           
        }
    }
    
}
function getUsers(req,res){
    User.find({},(err,users)=>{
        if(err){
            return res.status(500).send({message:"error general",err});
        }else if(users){
            return res.send({message:"usuarios registrados:",users});
        }else{
            return res.send({message:"no hay ningún usuario registrado"});
        }
    })
}

module.exports ={
    createInit,
    login,
    createUsuario,
    modifyRole,
    getUsers,
    deleteUser,
    modifyUser
}