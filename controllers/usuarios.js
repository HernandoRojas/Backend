const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const errors = require('../middlewares/validaciones');
const path = require('path');

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
    const {nombre, apellido, nickname, clave, rol} = req.body;
    const {imagen} = req.files;
    //imagen.name = nickname;
    const nombreimagen = imagen.name;//`${imagen.name}.jpg`;
    const usuario = new Usuario({nombre, apellido, nickname, clave, rol, imagen : nombreimagen}); // Se instancia el usuarioo al momento de la creación del mismo

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
    usuario.clave = bcryptjs.hashSync(clave, salt);

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.imagen) {
        res.status(400).json({
            msg:'No se encontró archivo para cargar'
        });
        return;
    }

    //let {imagen} = req.files;
    //imagen.name = nickname;
    const cargaPath = path.join(__dirname, '../imagenes/', imagen.name);


    // Use the mv() method to place the file somewhere on your server
    imagen.mv(cargaPath, (err) => {
        if (err){

            return res.status(500).json({
                err
            });
        }
        res.json({
            msg: 'El archivo fue cargado con éxito a ' + cargaPath,
            nombre, apellido, nickname, clave, rol, nombreimagen
        });
    });

    //Guardar usuario
    await usuario.save(); // se guardan los datos en la base de datos creandose el documento(registro) en la base de datos en la colección (Tabla) de usuarios 
}

//Función para enviar datos cuando se ejecuta un DELETE desde el front
const deleteUsuarios = async (req, res = response) => {

    const nickname = req.params.nickname; //Obtiene el nickname del usuario que se quiere eliminar y fue enviado por la url

    let usuario = await Usuario.findOne({nickname}); // Busca el usuario por nickname en la BD y lo guarda en la variable
    console.log(usuario); //mostrar el contenido de la variable


    if(usuario != null){ //si se encontró el usuario
        usuario = await Usuario.findOneAndDelete({nickname}); // se elimina el usuario con ese nickname
        res.json({
            msg: 'Usuario Eliminado', //se envia mensaje de respuesta
            usuario
        });
    } else {//si la variable usuario esta vacia, quiere decir que no se encontró usuario con ese nickname
        res.json({
        msg: 'El usuario a eliminar no existe'
        });
    }
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