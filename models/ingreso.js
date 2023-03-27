const { Schema, model } = require('mongoose');

const ingresoSchema = Schema({
    //date: { type: Date, default: Date.now },
    nickname : {
        type: String,
        required : [true, 'El nickname es obligatorio']
    },
    fecha : {
        type : Date,
        default: Date.now
    },
    resultado : {
        type: Boolean,
        default : false
    }

})


module.exports = model('Ingreso', ingresoSchema);