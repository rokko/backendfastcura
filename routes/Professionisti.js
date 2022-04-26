const express = require('express')
const Professionista = require('../models/Professionista')
const Appuntamento = require('../models/Appuntamento')
const Abbonamento = require('../models/Abbonamento')
const Curriculum = require('../models/Curriculm')
const Cliente = require('../models/Clienti')
const Contatto = require('../models/Contatti')
const auth = require('../middlewares/login')
const multer = require('multer')
const router = express()
const Avatar = require('../models/Avatar')


router.post('/ottieni-contatti',auth, async(req,res,next)=>{
    const contatti = await Contatto.find({id_professionista: req.user._id})
    res.send(contatti)
    
})

router.post('/inserisci-avatar',auth, async(req,res)=>{
    const avatar = await Avatar.findOne({id_professionista:req.user._id})

    if (avatar) {
        avatar.posizione = req.body.url
        await avatar.save()
        res.json({message:'Salvato',avatar})
    }
    else{
        const nuovoAvatar = await new Avatar({
            id_professionista:req.user._id,
            posizione:req.body.url
        })

        res.json({message:'Nuovo',nuovoAvatar})
    }
})
router.post('/avatar', auth, async(req,res)=>{

    const avatar = await Avatar.findOne({
        id_professionista : req.user._id
    })

    if (avatar) return res.json({message:1, avatar}) 
    else return res.json({message:0})
})
router.post('/info-cliente', async(req,res)=>{
    const clienteInfo = await Cliente.findOne({_id:req.body.id_cliente})
    res.send(clienteInfo)
})


router.post('/signup', async (req,res) => {

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
        res.json({result:'ok', message:utenteSalvato})
    })
router.post('/nomecliente', async(req,res)=> {

    const infoCliente =await Cliente.findOne({_id:req.body.idcliente})
    const infoProfessionista = await Professionista.findOne({_id:req.body.idcliente})
    if (infoCliente !=null) res.json({nome:infoCliente.nome,cognome:infoCliente.cognome})
   else res.json({nome:infoProfessionista.nome,cognome:infoProfessionista.cognome})
})
router.post('/ricerca', async(req,res)=>{
    const listaProfessionista = await Professionista.find({citta:req.body.citta, professione:req.body.professione})
        res.json({message:'ok', professionisti:listaProfessionista})
})
router.post('/crea-appuntamento',async  (req,res)=> {
    const nuovoAppuntamento = await  new Appuntamento({
        nome: req.body.nome,
        data: req.body.data,
        id_cliente : req.body.id_cliente,
        id_professionista : req.body.id_professionista,
        metodo_pagamento : req.body.metodo_pagamento,
        totale: req.body.totale,
        conferma :req.body.conferma,
        id_conversazione : req.body.id_conversazione,
    })

    const salvaAppuntamento  = await nuovoAppuntamento.save()

    res.json({message:'ok', appuntamento:salvaAppuntamento})
})

router.post('/modifica-abbonamento', auth, async (req,res,next)=>{
    const abbonamentoDaModificare = await Abbonamento.findOne({ id_professionista: req.user._id})

    res.json({ok:'ok'})
})
router.post('/lasciarecensione', async( req,res)=>{

})

router.get('/lista-appuntamenti',auth, async(req,res,next)=>{
    const listaAppuntamenti = await Appuntamento.find({id_professionista:req.user._id})
    if(!!listaAppuntamenti) res.json(listaAppuntamenti)
    else res.json({no: "ko"})

})

router.get('/ottieni-curriculum', auth,async(req,res)=>{
    const curriculum = await Curriculum.findOne({codiceProfessionista:req.user._id})
    if (curriculum) {res.json(curriculum)} else {res.json({data:1})}
})

router.get('/info', auth, async(req,res,next)=>{
    const utente = await Professionista.findOne({_id:req.user._id})
    res.json(utente)
})

router.post('/modificacurriculum', auth, async(req,res, next)=>{
    const curriculumDaAggiornare = await Curriculum.findOne({codiceProfessionista: req.user._id})
    if(!!curriculumDaAggiornare) {
        curriculumDaAggiornare.titolodistudio = req.body.titolodistudio;
        curriculumDaAggiornare.master = req.body.master;
        curriculumDaAggiornare.numeroiscrizione = req.body.numeroOrdine;
        curriculumDaAggiornare.esperienze = req.body.esperienze;
        curriculumDaAggiornare.altro = req.body.altro;
        const salvaCurriculum = await curriculumDaAggiornare.save()

        res.json(salvaCurriculum)
    }else{
        const nuovoCurriculum = new Curriculum({

            altro: req.body.altro,
            master:req.body.master,
            esperienze : req.body.esperienze,
            titolodistudio :req.body.titolodistudio,
            numeroiscrizione :req.body.numeroOrdine,
            codiceProfessionista : req.user._id

        })

        const salvaNuovo = await nuovoCurriculum.save()
        res.json(salvaNuovo)
    }
})



module.exports = router