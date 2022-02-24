const mongoose = require('mongoose')

const CurriculumSchema = mongoose.Schema({
    codiceProfessionista : String,
    titolodistudio: String,
    master:String,
    numeroiscrizione: String,
    esperienze: String,
    altro: String,
})



module.exports = mongoose.model('Curriculum', CurriculumSchema)