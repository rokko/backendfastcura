const mongoose = require('mongoose')

const AppuntamentoSchema = mongoose.Schema({
    data: String,
    id_cliente : String,
    id_professionista : String,
    metodo_pagamento : String,
    totale: Number,
    conferma : Boolean,
    id_conversazione : String,
    nome : String,

})

module.exports = mongoose.model('Appuntamento', AppuntamentoSchema)