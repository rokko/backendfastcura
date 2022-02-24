const express = require('express')
const Cliente = require('../models/Clienti')
const Curriculum = require('../models/Curriculm')
const router = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


router.post('/signup', async (req,res) => {

    const cliente = await  new Cliente({
        nome: req.body.nome,
        cognome: req.body.cognome,
        email : req.body.email,
        passw :req.body.password,
        sesso : req.body.sesso,
        data : req.body.data,
        codicepostale : req.body.cap,
        number : req.body.cellulare,
    })
    const salvaUtente = await cliente.save()
    res.json({message:'ok', utente:salvaUtente})
})

router.post('/login', (req,res)=> {
    const cliente = {
        email : req.body.email,
        password : req.body.password,
    }
    jwt.sign({
       cliente
    }, 'secretkey', (err, token)=>{
        res.json({
            token: token
        })
    })


  
})

router.post('/infocurriculum',async (req,res)=>{

    const RicercaCurriculum = await Curriculum.findOne({codiceProfessionista:req.body.idprofessionista})

    if(!!RicercaCurriculum) res.json({ris:1,RicercaCurriculum})
    else res.json({ris:2})

})


module.exports = router