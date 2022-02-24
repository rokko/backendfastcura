const mongoose = require('mongoose')

const ProfessionistaSchema = mongoose.Schema({
    nome: String,
    cognome: String,
    email : String,
    password : String,
    datadinascita : Date,
    sesso : String,
    citta : String,
    number : String,
    professione : String,
    greenpass : String,
    eta : String,
    referenze : String,
    annitalia : String,
    esperienza : String,
    motivotermine: String,
    livelloitaliano: String,
    titolodistudio : String,
    possessodilaurea: String,
    numeroiscrizione : String,
    assicurato : String,
    precedente : String,
    abbonamento: String,
    scadenza : Date,

})



module.exports = mongoose.model('Professionista', ProfessionistaSchema)