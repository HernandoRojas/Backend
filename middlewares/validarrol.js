const { request, response } = require("express");



const validarRol = (req = request, res = response, next) => {
    const usuarioAutenticado = req.usuario;
    const rol = usuarioAutenticado.rol;
    console.log(rol);

    if(rol == 'ADMIN'){
        next();
    } else{
        res.status(400).json({
            msg : 'No tienes permisos para realizar esta acción'
        });
    }

}


module.exports = {
    validarRol
}