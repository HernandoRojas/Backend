const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const errors = require('../middlewares/validaciones');

//Función para enviar datos cuando se ejecuta un GET desde el front
const getUsuarios = async (req = request, res = response) => {

    // se obtienen los parámetros que fueron enviados desde la url de la petición GET en el front
    const query = req.query;
    const {estado} = req.query;
    
    console.log(estado);
    //console.log(query);
    if(estado == undefined){ //si estado no fue enviado en los parámetros de la URL
        //GET para todos obtener todos los usuarios de la base de datos
        const usuarios = await Usuario.find(); // dentro del find() se puede enviar una consulta específica, ejemplo: find({estado : true})
        const total = await Usuario.countDocuments();

        //se envia respuesta en formato JSON   
        res.json({
            total,
            usuarios
        });
    }else { //Si estado fue enviado en parámetros de la URL
        
        //se obtienen los usuairos con el estadodefinido
        const usuarios = await Usuario.find({estado});
        const total = await Usuario.countDocuments({estado});
        res.json({
            total,
            usuarios
        });
    }   

}
    
//Método para obtener los usuarios por rol
const getUsuariosPorRol = async (req, res = response) => {
    
    //se obtiene el valor que fue enviado en la ruta del navegador
    const rol = req.params.rol;
    console.log(rol);

    if(rol == 'ADMIN' || rol == 'HABITANTE' || rol == 'VISITANTE'){
        const total = await Usuario.countDocuments({rol})
        //se encuentran los usuairo con ese rol
        const usuarios = await Usuario.find({rol});

        res.json({
            total,
            usuarios
        })
    } else {
        const usuario = await Usuario.find({nickname : rol});

        res.json({
            usuario
        })
    }

    //se cuenta el total de documentos por rol
    //const total = await Usuario.countDocuments({rol})
    //se encuentran los usuairo con ese rol
    //const usuarios = await Usuario.find({rol});

    //res.json({
    //    total,
    //    usuarios
    //})
}


//Función para enviar datos cuando se ejecuta un PUT desde el front
const putUsuarios = async (req, res = response) => {

    // se obtienen los parámetros que fueron enviados desde la url de la petición PUT en el front
    const nickname = req.params.nickname;
    // se obtiene el valor enviado en el body del JSON
    const { estado } = req.body;
    console.log(estado);
    console.log(nickname);

    //se buscan los usuarios con el nickname especificado y se cambia el estado al valor especificado y se almacena en la variable 'usuario' el nuevo valor de usuario (documento actualizado)
    const usuario = await Usuario.findOneAndUpdate({nickname},{estado}, { new : true } )
    .then(usuario => {
        if (!usuario) {
          //si la variable usuario está vacia, es decir, que no encontró usuario con ese nickname, el sistema mostrará ese mensaje como respuesta
          return res.status(404).send({ message: `User with nickname ${nickname} not found` }); 
        }
        //si todo funciona bien y la variable usuario si tiene valor entonces se envia el mensaje
        res.json({
            msg: 'Usuario actualizado correctamente',
            usuario
      })
    })
    //se captura el error en caso de que suceda
      .catch(err => {
        console.error(err);
        res.status(500).send({ message: 'Error updating user' });
      });

    console.log(usuario);
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
const deleteUsuarios = async (req, res = response) => {

    const nickname = req.params.nickname;
    //const usuarioAutenticado = req.usuario;

    //const rol = usuarioAutenticado.rol;
    //console.log(rol);
   
    //if(rol == 'ADMIN'){
        let usuario = await Usuario.findOne({nickname});
        console.log(usuario);


            if(usuario != null){
                usuario = await Usuario.findOneAndDelete({nickname});

                res.json({
                    msg: 'Usuario Eliminado',
                    usuario
            });
            } else {
                res.json({
                    msg: 'El usuario a eliminar no existe'
            });
            }

    //} else {
        //res.status(400).json({
        //    msg : 'No tienes permisos para realizar esta acción'
        //})
    //}

    


    //se envia respuesta en formato JSON
    
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
    patchUsuarios,
    getUsuariosPorRol
}