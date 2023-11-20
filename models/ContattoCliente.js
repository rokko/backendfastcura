const mongoose = require('mongoose')

const ContattoClienteSchema = mongoose.Schema({
    id_professionista:String,
    nome_professionista:String,
    cognome_professionista:String,
    numero_professionista:String,
    citta_professionista:String,
    professione_professionista:String,
    nome_cliente:String,
    numero_cliente:String,
    email_cliente:String,
    data:Date,
    email_inviata:Boolean,
})

module.exports = mongoose.model('ContattoCliente', ContattoClienteSchema)