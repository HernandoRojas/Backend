const express = require('express'); // se importa express
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{
    //Se crea la clase servidor

    constructor(){
        this.app = express() //se levanta el servidor (aplicación express)
        this.port = process.env.PORT; //Se define el puerto en el que corre el servidor por medio de la variable puerto que viene de la variable global en el archivo .env
        this.usuariosPath = '/api/usuarios';

        //Conectar a base de datos
        this.conectarBD();

        //Middlewares
        this.middlewares();

        //Lectura y Parseo del body
        this.app.use(express.json());

        //Rutas de la aplicación
        this.routes();
    }

    async conectarBD(){
        await dbConnection();
    }

    middlewares(){
        //metodo para definir los middleware - el middleware es una función que se ejecuta cuando se levanta el servidor
        this.app.use(express.static('public')); //Directorio público (carpeta pública)
        this.app.use(cors());
    }
  
    routes(){
        //Se definen las rutas de la aplicacicón
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }

    listen(){
        //se define el puerto y se pone a la escucha el servidor
        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en puerto", this.port)
        });
    }
}


module.exports = Server;