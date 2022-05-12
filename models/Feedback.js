const mongoose = require('mongoose')

const FeedbackSchema = mongoose.Schema({
    voto: Number,
    id_professionista: String
})



module.exports = mongoose.model('Feedback', FeedbackSchema)