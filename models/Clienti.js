const mongoose = require('mongoose')

const ClienteSchema = mongoose.Schema({
    nome: String,
    cognome: String,
    email : String,
    passw : String,
    data : Date,
    sesso : String,
    codicepostale : String,
    number : String,

})

module.exports = mongoose.model('Cliente', ClienteSchema)