const { response, request } = require('express');
const { validationResult } = require('express-validator');


const validarCampos = (req = request, res = response ,next) => {
    //Middleware para validar los campos e imprime el mensaje de error
    const errors = validationResult(req) ;
    if(!errors.isEmpty){
        return res.status(400).json(errors);
    }
    next();
}



module.exports = {
    validarCampos
}
