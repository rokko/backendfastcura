const mongoose = require('mongoose')

const AppuntamentoSchema = mongoose.Schema({
    data: Date,
    id_cliente : String,
    id_professionista : String,
    metodo_pagamento : String,
    totale: Number,
})

module.exports = mongoose.model('Appuntamento', AppuntamentoSchema)