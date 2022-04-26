const mongoose = require('mongoose')

const AvatarSchema = mongoose.Schema({
    id_professionista : String,
    posizione : String
})

module.exports = mongoose.model('Avatar', AvatarSchema)