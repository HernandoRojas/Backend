const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generarJWT");

const login = async (req, res = response) => {

    const {nickname, clave} = req.body;//Se obtienen los parametros enviados por el body 

    try {

        //Verificar si nickname existe
        const usuario = await Usuario.findOne({nickname});
        if(!usuario){
            return res.status(400).json({
                msg : `El usuario con nickname ${nickname} no existe`
            })
        }

        //Verificar el estado del usuario (Activo o inactivo)
        if (!usuario.estado){
            return res.status(400).json({
                msg: `El usuario ${nickname} no se encuentra activo en el sistema`
            })
        }
        
        //Verificar contraseña
        const validarClave = bcryptjs.compareSync( clave, usuario.clave);
        if (!validarClave){
            return res.status(400).json({
                msg: 'La clave es incorrecta'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'login exitoso',
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            
            msg: 'Algo salió mal',

        })
    }

}

const validarToken = async (req, res = response) => {
    const usuario = req.usuario;

    const nickname = usuario.nickname;

    res.json({
        nickname
    })
}

module.exports = {
    login,
    validarToken
}