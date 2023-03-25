const { Router } = require('express');
const { body , check} = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validaciones');

const router = Router(); //Se instancia la clase Router la cual ayudará con el enrutamiento hacia las rutas del controlador

router.post('/login', [
    body('nickname' , 'El nickname es obligatorio').isAlphanumeric(),
    body('clave', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
] , login)



module.exports = router;