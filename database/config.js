const mongoose = require('mongoose');

const dbConnection = async () => {
        //Se establecen parámetros para conectar a base de datos y se controlan errores de conexión
        try {
            await mongoose.connect(process.env.MONGODB_ATLAS);
            console.log('Conexión a base de datos establecida')
        } catch (error) {
            console.log(error)
            throw new Error('Error en la conexión con la base de datos')
        }
}


module.exports = {
    dbConnection
}