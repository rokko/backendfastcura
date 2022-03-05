const express = require('express')
const Professionista = require('../models/Professionista')
const Appuntamento = require('../models/Appuntamento')
const Abbonamento = require('../models/Abbonamento')
const Curriculum = require('../models/Curriculm')
const Cliente = require('../models/Clienti')
const auth = require('../middlewares/login')

const router = express()
const bcrypt = require('bcrypt')




router.post('/signup', async (req,res) => {
    console.log(req.body)

    const nuovoProfessionista = new Professionista({
        nome:req.body.nome,
        cognome:req.body.cognome,
        email :req.body.email,
        password : req.body.password,
        datadinascita : req.body.data,
        sesso : req.body.sesso,
        citta : req.body.citta,
        number : req.body.cellulare,
        professione : req.body.professione,
        greenpass : req.body.greenpass,
        referenze : req.body.referenze,
        annitalia : req.body.anni,
        esperienza : req.body.anniEsperienza,
        motivotermine: req.body.terminelavoro,
        livelloitaliano: req.body.livelloItaliano,
        titolodistudio : req.body.titoloStudio,
        possessodilaurea: req.body.possessodilaurea,
        numeroiscrizione : req.body.numeroiscrizione,
        assicurato : req.body.assicurato,
        precedente : req.body.precedente})
        const utenteSalvato = await nuovoProfessionista.save()
        console.log(utenteSalvato)
        res.json({result:'ok', message:utenteSalvato})
    })
router.post('/nomecliente', async(req,res)=> {
    const infoCliente =await Cliente.findOne({_id:req.body.idcliente})
    res.json({nome:infoCliente.nome,cognome:infoCliente.cognome})
})
router.post('/ricerca', async(req,res)=>{
    const listaProfessionista = await Professionista.find({codicepostale:req.body.codicepostale, professione:req.body.professione})
        res.json({message:'ok', professionisti:listaProfessionista})
})
router.post('/crea-appuntamento',async  (req,res)=> {
    const nuovoAppuntamento = await  new Appuntamento({
        data: req.body.data,
        id_cliente : req.body.id_cliente,
        id_profesionista : req.body.id_profesionista,
        metodo_pagamento : req.body.metodo_pagamento,
        totale: req.body.totale,
    })

    const salvaAppuntamento  = await nuovoAppuntamento.save()

    res.json({message:'ok', appuntamento:salvaAppuntamento})
})
router.post('/modifica-abbonamento', auth, async (req,res,next)=>{
    const abbonamentoDaModificare = await Abbonamento.findOne({ idProfessionista: req.user._id})

    res.json({ok:'ok'})
})
router.post('/lasciarecensione', async( req,res)=>{

})

router.get('/lista-appuntamenti',auth, async(req,res,next)=>{
    const listaAppuntamenti = await Appuntamento.find({idProfessionista:req.user._id})
    if(!!listaAppuntamenti) res.json(listaAppuntamenti)
    else res.json({no: "ko"})

})

router.get('/ottieni-curriculum', auth,async(req,res)=>{
    const curriculum = await Curriculum.findOne({idProfessionista:req.user._id})
    if (curriculum) res.json(curriculum)
})

router.get('/info', auth, async(req,res,next)=>{
    const utente = await Professionista.findOne({_id:req.user._id})
    res.json(utente)
})

router.post('/modificacurriculum', auth, async(req,res, next)=>{
    const curriculumDaAggiornare = await Curriculum.findOne({idProfessionista: req.user._id})
    if(!!curriculumDaAggiornare) {
        curriculumDaAggiornare.titolodistudio = req.body.titolodistudio;
        curriculumDaAggiornare.master = req.body.master;
        curriculumDaAggiornare.numeroiscrizione = req.body.numeroOrdine;
        curriculumDaAggiornare.esperienze = req.body.esperienze;
        curriculumDaAggiornare.altro = req.body.altro;
        const salvaCurriculum = await curriculumDaAggiornare.save()
        console.log('FATTO')

        res.json(salvaCurriculum)
    }else{
        const nuovoCurriculum = new Curriculum({

            altro: String,
            titolo :req.body.titolodistudio,
            master:req.body.master,
            esperienze : req.body.esperienze,
            titolodistudio :req.body.altro,
            numeroiscrizione :req.body.numeroOrdine,
            codiceprofessionista : req.user._id

        })

        const salvaNuovo = await nuovoCurriculum.save()
        res.json(salvaNuovo)
    }
})



module.exports = router