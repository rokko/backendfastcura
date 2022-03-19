const express = require ('express')
const app = express()
const http = require('http').createServer(app);
http.listen(process.env.PORT||8080, ()=> {
    console.log(`Connesso su porta ${process.env.PORT}`)
})


const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const professionistaRoute = require('./routes/Professionisti')
const clienteRoute = require('./routes/Clienti')
const messaggiRoute = require('./routes/Chat2')
const aut = require('./middlewares/login')
const Cliente = require('./models/Clienti')
const Professionista = require('./models/Professionista')
const io = require('socket.io')(http,{cors: {
    origin: '*',
  }})
require("dotenv").config();
app.use(bodyParser.json())
app.use(cors())

io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */
console.log('dèf')
socket.on('ciao', ()=>{console.log('cika')})
socket.on('invio-messaggio',()=>{
    console.log('ok')
    socket.emit('aggiornaachat')
})
});



app.get('/' , aut, (req,res)=>{
    res.json({ciao:'ciao'})
})


app.post('/login', async (req,res)=>{
    const email = req.body.email
    const password = req.body.password
    console.log(email,password)
    const loginCliente = await Cliente.findOne({email : email , passw:password})
    console.log(loginCliente)
    const loginProfessionista = await Professionista.findOne({email:email, passw:password})
    if (!!loginCliente) {
        const accessToken = jwt.sign(loginCliente.toJSON(), process.env.ACCESS_TOKEN_SECRET)
        res.json({accessToken:accessToken})

    }
    else if (!!loginProfessionista){
        const accessToken = jwt.sign(loginProfessionista.toJSON(), process.env.ACCESS_TOKEN_SECRET)
        res.json({accessToken:accessToken})

    }
    else {
        res.json({accessToken: null})
    }
})
app.use('/professionista', professionistaRoute)
app.use('/cliente', clienteRoute)
app.use('/chat', messaggiRoute)


mongoose.connect('mongodb+srv://fastcurautente:Fastcura22@cluster0.tvrmv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&ssl=true',{useNewUrlParser: true}, (x) => {
    console.log('Connesso Mongo DB')
})



