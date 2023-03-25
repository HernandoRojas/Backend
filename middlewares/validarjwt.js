const jwt = require('jsonwebtoken');
const {response, request} = require('express');
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const validarJwt = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg : 'No hay token en la petición'
        });
    }
    console.log(token);

    //Validación del JWT
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Se extrae el usuario que está autenticado que corresponde al uid
        const usuario = await Usuario.findById(uid);
        

        
        req.usuario = usuario;

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