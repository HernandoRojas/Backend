const { response, request } = require('express');
const { validationResult } = require('express-validator');

const existeUsuarioPorId = async (id) => {

    //Verificar que si existe el usuario por ID
    const existe = await Usuario.findById(id);
    if ( !existe ){
        throw new Error(`El id ${id} No existe`)
    }

}

module.exports = {
    existeUsuarioPorId
}