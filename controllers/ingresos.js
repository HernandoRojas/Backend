const { response, request } = require('express');
const path = require('path');
const Usuario = require('../models/usuario');
const Ingreso = require('../models/ingreso');
//const bcryptjs = require('bcryptjs');
//const errors = require('../middlewares/validaciones');
const {ingresosDia} = require('../helpers/ingresospordia');
const {fs} = require('fs/promises');
const archiver = require('archiver');


const postIngreso = async (req = request, res = response) => {
    
    let fecha = new Date();
    let hoy = new Date(fecha.getTime() - 5 * 60 * 60 * 1000 ); // Se restan 5 horas

    const {nickname , resultado} = req.body;

    const ingreso = new Ingreso({nickname, fecha : hoy, resultado});

    //Se verifica si el nickname existe
    const validarNick = await Usuario.findOne({nickname})
    if (validarNick){
        //Guardar ingreso
        await ingreso.save(); // se guardan los datos en la base de datos creandose el documento(registro) en la base de datos en la colección (Tabla) de ingresos
        //se envia respuesta en formato JSON
        res.json({
            msg: 'Post API - Controlador',
            ingreso
        });
    } else {
        return res.status(400).json( //Con la palabra return basta para que el controlador se detenga y no se continue ejecutando el método post
            {
                msg : "El nickname no existe"
            }
        );
    }

}

const getIngreso = async (req = request, res = response) => {

    let hoy= new Date();

    let semanaPasada = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000); // Restamos 7 días en milisegundos
    hoy = hoy.toISOString(); //se pasa el formato fecha a un formato  ISODate (fecha ISO)
    semanaPasada  = semanaPasada.toISOString(); //se pasa el formato fecha a un formato  ISODate (fecha ISO)

    const query = req.query;
    let { nickname, inicio, fin} = req.query;


    if(nickname == undefined){ //No se obtiene nickname ni parámetros de fechas
        //GET para todos obtener todos los ingresos de la base de datos en la ultima semana
        const ingresos = await Ingreso.find({fecha : {
            $gte : semanaPasada,
            $lte : hoy
        }});
        const total = await Ingreso.countDocuments({fecha : {
            $gte : semanaPasada,
            $lte : hoy
        }});

        //se envia respuesta en formato JSON   
        res.json({
            ingresos
        });
    } else if(!inicio){ //Se recibió nickname pero no fechas

        //Se valida si existe el usuario
        const validarNick = await Usuario.findOne({nickname})
        if (!validarNick){
            return res.status(400).json( //Con la palabra return basta para que el controlador se detenga y no se continue ejecutando el método post
            {
                msg : "El nickname no existe"
            });
        };

        const ingresos = await Ingreso.find({nickname,fecha : {
            $gte : semanaPasada,
            $lte : hoy
        }});
        const total = await Ingreso.countDocuments({nickname,fecha : {
            $gte : semanaPasada,
            $lte : hoy
        }});
        res.json({
            total,
            ingresos
        });
    } else { //caso donde se recibe nick y fechas
        
        const validarNick = await Usuario.findOne({nickname})
        if (!validarNick){
            return res.status(400).json( //Con la palabra return basta para que el controlador se detenga y no se continue ejecutando el método post
            {
                msg : "El nickname no existe"
            });
        };

        inicio = new Date(inicio); //se pasa el string a un formato fecha
        fin = new Date(fin); //se pasa el string a un formato fecha
        fin = new Date(fin.getTime() + 24 * 60 * 60 * 1000);
        inicio = inicio.toISOString(); //se pasa el formato fecha a un formato  ISODate (fecha ISO)
        fin = fin.toISOString(); //se pasa el formato fecha a un formato  ISODate (fecha ISO)

        console.log(fin);

        const consulta = await Ingreso.find({ nickname,
            fecha : {
                $gte : inicio,
                $lte : fin
            }
        });

        if (consulta.length === 0){
            res.status(400).json({
                msg: 'no se encontraron resultados en el rango de fechas seleccionado'
            });
        } else {
            res.json({
                msg: 'Consulta exitosa',
                consulta
            });
        };
    };
    

}

const getIngresoUltimaSemana = async (req = request, res = response) => {

    const {nickname} = req.query;

    let hoy= new Date();
    hoy = new Date(hoy.getTime() - 5 * 60 * 60 * 1000);

    let semanaPasada = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000); // Restamos 7 días en milisegundos
    hoy = hoy.toISOString(); //se pasa el formato fecha a un formato  ISODate (fecha ISO)
    semanaPasada  = semanaPasada.toISOString();

    if (nickname == undefined){
        const ingresos = await Ingreso.find({fecha : {
            $gte : semanaPasada,
            $lte : hoy
        }});
        const total = await Ingreso.countDocuments({fecha : {
            $gte : semanaPasada,
            $lte : hoy
        }});
     
        const respuesta = ingresosDia(ingresos);
    
        res.json({
           // msg: 'Funciona correctamente'
           respuesta
        })
    } else {
        //Se valida si existe el usuario
        const validarNick = await Usuario.findOne({nickname})
        if (!validarNick){
            return res.status(400).json( //Con la palabra return basta para que el controlador se detenga y no se continue ejecutando el método post
            {
                msg : "El nickname no existe"
            });
        };

        const ingresos = await Ingreso.find({nickname, fecha : {
            $gte : semanaPasada,
            $lte : hoy
        }});
        const total = await Ingreso.countDocuments({nickname, fecha : {
            $gte : semanaPasada,
            $lte : hoy
        }});
     
        const respuesta = ingresosDia(ingresos);
    
        res.json({
           // msg: 'Funciona correctamente'
           respuesta
        })
    }

    
}

const getImagenes = async (req = request, res = reponse ) => {

    const {nickname} = req.query;

    if (nickname != undefined ){
       //Se verifica si el nickname existe
       const validarNick = await Usuario.findOne({nickname})
       if (validarNick){
           //Devolver imagen
           const usuario = await Usuario.find({nickname});

           const estado = usuario.map( usuario => usuario.estado);
           const imagen = usuario.map( usuario=> usuario.imagen);
           console.log(imagen[0]);
           if(estado){
               const rutaImagen = path.join(__dirname, '../imagenes/', imagen[0]);
               // Enviamos la imagen al cliente
               res.sendFile(rutaImagen);
           } else {
               res.json({
                   msg: 'el usuario no se encuentra activo',
                   estado : false
               })
           }
       } else {
           return res.status(400).json( //Con la palabra return basta para que el controlador se detenga y no se continue ejecutando el método post
               {
                   msg : "El nickname no existe"
               }
           );
       }
    } else {
        res.status(400).json({
            msg: 'no se recibió número de usuario'
        })
    }
}

module.exports = {
    postIngreso,
    getIngreso,
    getIngresoUltimaSemana,
    getImagenes
}