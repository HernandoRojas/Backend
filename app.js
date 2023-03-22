require('dotenv').config(); // se importa dotenv para variables de entorno

const Server = require('./models/server'); // se importa el modelo server para poder instanciar la clase servidor

const server = new Server(); //se instancia la clase servidor

server.listen(); // se llama el método listen de la instancia del servidor (con esto queda levantado el servidor)

//Modificación