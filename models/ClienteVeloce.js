const mongoose = require('mongoose')

const ClienteVeloceSchema = mongoose.Schema({
    nomecognome: String,
    email : String,
    data : Date,
    number : String,

})

module.exports = mongoose.model('ClienteVeloce', ClienteVeloceSchema)