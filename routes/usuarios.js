const { Router } = require('express');
const { body, check } = require('express-validator');
const { getUsuarios , 
        putUsuarios , 
        postUsuarios , 
        deleteUsuarios , 
        patchUsuarios,
        getUsuariosPorRol
 } = require('../controllers/usuarios');
const {validarCampos} = require('../middlewares/validaciones');
const { existeUsuarioPorId } = require('../helpers/db-validators');
const { validarJwt } = require('../middlewares/validarjwt');
const { validarRol } = require('../middlewares/validarrol');

const router = Router(); //Se instancia la clase Router la cual ayudará con el enrutamiento hacia las rutas del controlador

//NOTA: En las rutas usualmente van 2 parámetros:
//1. la ruta que se debe manejar 
//2. La función que se debe ejecutar cuando se recibe la petición HTTP

//En caso que vayan 3 parámetros en las rutas:
//1. la ruta que se debe manejar 
//2. El middleware que se quiera usar:
//      En caso que se quiera mandar un middleware se envia normal en caso que se envien varios se deben enviar como un arreglo : [Middlewares]
//3. La función que se debe ejecutar cuando se recibe la petición HTTP


//Se definen las rutas para cada método 
router.get('/', getUsuarios)

router.get('/:rol', getUsuariosPorRol)

router.put('/:nickname',[
        validarJwt, //Valida que exista token en la solicitud
        validarRol //Valida el rol del usuario que va a realiza la acción
],putUsuarios)

router.post('/',[
        validarJwt, //Valida que exista token en la solicitud
        validarRol, //Valida el rol del usuario que va a realiza la acción
        //Los siguientes middlewares se ejecutaran antes de continuar con el método POST, verificará que todo se encuentre bien
        body('nickname','El nickname ingresado no es válido').isAlphanumeric(),
        body('rol', 'El rol debe ser un rol válido' ).isIn(['ADMIN','HABITANTE','VISITANTE']),
        validarCampos
] ,postUsuarios)

router.delete('/:nickname', [
        validarJwt, //Valida que exista token en la solicitud
        validarRol //Valida el rol del usuario que va a realiza la acción
],deleteUsuarios)

router.patch('/', patchUsuarios)

module.exports = router;