const jwt = require('jsonwebtoken');
const {response, request} = require('express');
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const validarJwt = async (req = request, res = response, next) => {

    const token = req.header('x-token'); //Obtiene el token enviado en el header junto con la solicitud a la URL

    if(!token){ //Valida si existe token en la petición
        return res.status(401).json({
            msg : 'No hay token en la petición'
        });
    }
    //console.log(token);

    //Validación del JWT
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY); //Se obtiene el uid de la persona logueada por medio del jwt
        //console.log(exp);
        //Se extrae el usuario que está autenticado que corresponde al uid
        const usuario = await Usuario.findById(uid);
        
        //const tokenExpirado = exp < Date.now() / 1000;
        

        req.usuario = usuario; //Se asignan los datos de ese usuario al usuario que se esta manejando en la petición

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

    
}

module.exports = {
    validarJwt
} 