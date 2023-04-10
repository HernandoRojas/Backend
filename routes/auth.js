const { Router } = require('express');
const { body , check} = require('express-validator');
const { login,
        validarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validaciones');
const { validarJwt } = require('../middlewares/validarjwt');

const router = Router(); //Se instancia la clase Router la cual ayudará con el enrutamiento hacia las rutas del controlador

router.post('/login', [
    body('nickname' , 'El nickname es obligatorio').isAlphanumeric(),
    body('clave', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
] , login)

router.get('/validarToken',[validarJwt],//Valida que exista token en la solicitud
validarToken)

module.exports = router;