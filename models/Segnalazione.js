const mongoose = require('mongoose')

const SegnalazioneSchema = mongoose.Schema({
    data: Date,
    citta : String,
    professione: String,
    email: string,
})

module.exports = mongoose.model('Segnalazione', SegnalazioneSchema)