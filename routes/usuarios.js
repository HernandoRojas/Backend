const { Router } = require('express');
const { body } = require('express-validator');
const { getUsuarios , 
        putUsuarios , 
        postUsuarios , 
        deleteUsuarios , 
        patchUsuarios } = require('../controllers/usuarios');
const {validarCampos} = require('../middlewares/validaciones');

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

router.put('/:id', putUsuarios)

router.post('/',[
        //Los siguientes middlewares se ejecutaran antes de continuar con el método POST, verificará que todo se encuentre bien
        body('nickname','El nickname ingresado no es válido').isAlphanumeric(),
        body('rol', 'El rol debe ser un rol válido' ).isIn(['ADMIN','HABITANTE','VISITANTE']),
        validarCampos
] ,postUsuarios)

router.delete('/', deleteUsuarios)

router.patch('/', patchUsuarios)

module.exports = router;