const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    
    contatti_id:String,
    sender: String,
    message:String,
    sendreader : Boolean,
    ricreader : Boolean,
}
)

module.exports = mongoose.model('Message', MessageSchema)