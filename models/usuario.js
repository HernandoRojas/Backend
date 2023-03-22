const { Schema, model } = require('mongoose');

const usuarioSchema = Schema({
    nombre: { 
        type : String,
        required : [true, 'El nombre es obligatorio']
    },
    apellido: {
        type: String
    },
    nickname: {
        type: String,
        required : [true, 'El nickname es obligatorio'],
        unique: true
    },
    clave: {
        type: String,
        required : [true, 'La contraeña es obligatoria']
    },
    rol: {
        type: String,
        emun: ['ADMIN', 'HABITANTE', 'VISITANTE' ],
        required : [true, 'El rol es obligatorio']
    },
    imagen: {
        type: String,
        required : [true, 'La imagen es obligatoria']
    },
    estado: {
        type: Boolean,
        default: true
    }
})


module.exports = model('Usuario', usuarioSchema);