const mongoose = require('mongoose')

const AbbonamentoSchema = mongoose.Schema({
    data: Date,
    id_professionista : String,
    tipoAbbonamento: String,
    attivo : Boolean,
})

module.exports = mongoose.model('Abbonamento', AbbonamentoSchema)