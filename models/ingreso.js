const { Schema, model } = require('mongoose');

const ingresoSchema = Schema({
    //date: { type: Date, default: Date.now },
})


module.exports = model('Ingreso', usingresoSchema);