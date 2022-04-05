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




app.get('/' , aut, (req,res)=>{
    res.json({ciao:'hi'})
})


app.post('/login', async (req,res)=>{
    const email = req.body.email
    const password = req.body.password
    const loginCliente = await Cliente.findOne({email : email , passw:password})
    const loginProfessionista = await Professionista.findOne({email:email, passw:password})
    if (!!loginCliente) {
        const accessToken = jwt.sign(loginCliente.toJSON(), process.env.ACCESS_TOKEN_SECRET)
        res.json({message:0, accessToken:accessToken})

    }
    else if (!!loginProfessionista){
        const accessToken = jwt.sign(loginProfessionista.toJSON(), process.env.ACCESS_TOKEN_SECRET)
        res.json({messagge:1, accessToken:accessToken})

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



