const mongoose = require('mongoose')

const ContattoSchema = mongoose.Schema({
    id_professionista:String,
    id_cliente : String,
})

module.exports = mongoose.model('Contatto', ContattoSchema)