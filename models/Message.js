const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    
    contatti_id:String,
    sender: String,
    message:String,
}
)

module.exports = mongoose.model('Message', MessageSchema)