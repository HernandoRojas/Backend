const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const errors = require('../middlewares/validaciones');

//Función para enviar datos cuando se ejecuta un GET desde el front
const getUsuarios = (req = request, res = response) => {

    // se obtienen los parámetros que fueron enviados desde la url de la petición GET en el front
    const query = req.query;

    //se envia respuesta en formato JSON
    res.json({
        msg: 'Get API - controlador',
        query
    });
}

//Función para enviar datos cuando se ejecuta un PUT desde el front
const putUsuarios = (req, res = response) => {

    // se obtienen los parámetros que fueron enviados desde la url de la petición PUT en el front
    const id = req.params.id;

    //se envia respuesta en formato JSON
    res.json({
        msg: 'Put API - Controlador',
        id
    });
}

//Función para enviar datos cuando se ejecuta un POST desde el front
const postUsuarios = async (req, res = response) => {

    // se obtienen los parámetros que fueron enviados desde la url de la petición POST en el front
    const {nombre, apellido, nickname, clave, rol, imagen} = req.body;
    const usuario = new Usuario({nombre, apellido, nickname, clave, rol, imagen}); // Se instancia el usuairo al momento de la creación del mismo

    //Se verifica si el nickname existe
    const validarNick = await Usuario.findOne({nickname})
    if (validarNick){
        return res.status(400).json(
            {
                msg : "El nickname ya existe"
            }
        ); //Con la palabra return basta para que el controlador se detenga y no se continue ejecutando el método post
    }

    // Se encripta contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.clave = bcryptjs.hashSync(clave, salt)

    //Guardar usuario
    await usuario.save(); // se guardan los datos en la base de datos creandose el documento(registro) en la base de datos en la colección (Tabla) de usuarios 

    //se envia respuesta en formato JSON
    res.json({
        msg: 'Post API - Controlador',
        nombre, apellido, nickname, clave, rol, imagen
    });
    //res.json(body) // para mostrar solo el body tal como viene
}

//Función para enviar datos cuando se ejecuta un DELETE desde el front
const deleteUsuarios = (req, res = response) => {

    //se envia respuesta en formato JSON
    res.json({
        msg: 'Delete API - Controlador'
    });
}

//Función para enviar datos cuando se ejecuta un PATCH desde el front
const patchUsuarios = (req, res = response) => {

    //se envia respuesta en formato JSON
    res.json({
        msg: 'Patch API - Controlador'
    });
}

module.exports = {
    getUsuarios,
    putUsuarios,
    postUsuarios,
    deleteUsuarios,
    patchUsuarios
}