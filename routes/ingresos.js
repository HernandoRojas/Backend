const { Router } = require('express');
const { body , check} = require('express-validator');
const { postIngreso,
        getIngreso,
        getIngresoUltimaSemana,
        getImagenes
} = require('../controllers/ingresos')
const { validarCampos } = require('../middlewares/validaciones');

const router = Router(); //Se instancia la clase Router la cual ayudará con el enrutamiento hacia las rutas del controlador

router.post('/', postIngreso)

router.get('/', getIngreso)

router.get('/UltimaSemana/', getIngresoUltimaSemana)

router.get('/imagenes/', getImagenes)

//router.get(':nickname', getIngresoPorNick)


module.exports = router;