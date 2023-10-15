const mongoose = require('mongoose')

const SegnalazioneSchema = mongoose.Schema({
    data: Date,
    citta : String,
    professione: String,
    email: String,
})

module.exports = mongoose.model('Segnalazione', SegnalazioneSchema)