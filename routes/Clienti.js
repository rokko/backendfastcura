const express = require('express')
const Cliente = require('../models/Clienti')
const Contatto = require('../models/Contatti')
const Curriculum = require('../models/Curriculm')
const Appuntamento = require('../models/Appuntamento')
const router = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const auth = require('../middlewares/login')



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

router.post('/info-appuntamento', async (req,res)=>{
    const appuntamento = await Appuntamento.findOne({id_conversazione:req.body.id_conversazione})
    res.json(appuntamento)
} )




router.post('/nuovo-contatto', auth, async (req,res,next)=>{


    const ceContatto = await Contatto.findOne({id_professionista:req.body.id_professionista, id_cliente:req.user._id})
    if (!!ceContatto){
        res.send(ceContatto)
    }
        else{
           const nuovoContatto= await new Contatto({
                id_professionista: req.body.id_professionista,
                id_cliente: req.user._id
            })

            await nuovoContatto.save()
            res.send(nuovoContatto)
        }
    })

 

module.exports = router