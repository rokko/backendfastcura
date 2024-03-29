const express = require("express");
const Cliente = require("../models/Clienti");
const Contatto = require("../models/Contatti");
const Curriculum = require("../models/Curriculm");
const Appuntamento = require("../models/Appuntamento");
const ClienteVeloce= require("../models/ClienteVeloce");
const ContattoCliente = require('../models/ContattoCliente')
const Feedback = require("../models/Feedback");
const router = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/login");
const axios = require("axios");


const nodemailer = require("nodemailer");
const Professionista = require("../models/Professionista");

let transporter = nodemailer.createTransport({
  service: "Outlook365",
  auth: {
    user: "amministrazione@fastcura.com",
    pass: "Amlodipina.1",
  },
});

router.post("/test", async (req, res) => {
  const message = {
    from: "amministrazione@fastcura.com",
    to: "rocco.caricola89@gmail.com",
    subject: "Iscrizione FASTCURA",
    text: "Ti diamo il Benvenuto su Fastcura.it , vieni sul nostro sito per trovare il professionista piu adatto alle tue necessita",
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });

  res.json({ message: "ok" });
});

router.get("/info", auth, async (req, res, next) => {
  const utente = await Cliente.findOne({ _id: req.user._id });
  res.json(utente);
});
router.post("/ottieni-chat", auth, async (req, res) => {
  const contatti = await Contatto.find({ id_cliente: req.user._id });
  res.send(contatti);
});
router.post("/signup-veloce", async (req, res) => {
  const cliente = await new ClienteVeloce({
    nomecognome: req.body.nomecognome,
    email: req.body.email.toLowerCase(),
    data: new Date(),
    number: req.body.cellulare,
  });

  const clienteVeloceSalvato = await cliente.save();
  res.json({result:'SUCCESS'})
  
})

router.post('/crea-contatto',async(req,res)=>{
  const professionista = await Professionista.findOne({
    number: req.body.numero_professionista,
  });

  console.log(professionista)



  const newContatto = await new ContattoCliente({
    id_professionista : professionista._id,
    nome_professionista: professionista.nome,
    cognome_professionista: professionista.cognome,
    numero_professionista: professionista.number,
    citta_professionista : professionista.citta,
    professione_professionista : professionista.professione,
    nome_cliente: req.body.nomecognome,
    numero_cliente: req.body.cellulare,
    email_cliente : req.body.email,
    data:new Date(),
    email_inviata:false
  })

  const contatto = await newContatto.save()
  res.json({newContatto})
   


})

router.post("/signup", async (req, res) => {
  const cliente = await new Cliente({
    nome: req.body.nome,
    cognome: req.body.cognome,
    email: req.body.email.toLowerCase(),
    passw: req.body.password,
    sesso: req.body.sesso,
    data: req.body.data,
    codicepostale: req.body.cap,
    number: req.body.cellulare,
  });
  axios
    .post("https://textbelt.com/text", {
      phone: `+39${req.body.cellulare}`,
      message:
        "Benvenuto nella fastcura family😄 ,Da ora preparati perché le tue giornate saranno ricche di appuntamenti! Per qualsiasi dubbio non esitare a contattarci 🙂",
      key: "4288d1e08d4acffcc621a78ebba58da8a61c9742sxfNo2GI00S9DSnzm5pqZ2tnT",
    })
    .then((response) => {
      console.log(response.data);
    });
  const message = {
    from: "amministrazione@fastcura.com",
    to: req.body.email,
    subject: "Iscrizione FASTCURA",
    text: "Ti diamo il Benvenuto su Fastcura.it , vieni sul nostro sito per trovare il professionista piu adatto alle tue necessita",
  };

  const salvaUtente = await cliente.save();
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  res.json({ message: "ok", utente: salvaUtente });
});

let post = router.post("/aggiorna-password", auth, async (req, res) => {
  const cliente = await Cliente.findOne({ _id: req.user._id });
  if (cliente.password === req.body.passAttuale) {
    cliente.password = req.body.nuova;
    await cliente.save();
    const message = {
      from: "amministrazione@fastcura.com",
      to: cliente.email,
      subject: "Modifica Password",
      text:
        "La modifica della password è avvenuta con successo, la tua nuova password è " +
        req.body.nuova +
        "conservala in maniera sicura",
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });

    res.json({ message: 1 });
  } else {
    res.json({ message: 0 });
  }
});

router.post("/login", (req, res) => {
  const cliente = {
    email: req.body.email,
    password: req.body.password,
  };
  jwt.sign(
    {
      cliente,
    },
    "secretkey",
    (err, token) => {
      res.json({
        token: token,
      });
    }
  );
});
router.post("/ottieni-profilo", auth, async (req, res) => {
  const profiloutente = await Cliente.findOne({ _id: req.user._id });
  if (!!profiloutente) res.json(profiloutente);
  else res.json({ message: "ko" });
});
router.post("/infocurriculum", async (req, res) => {
  const RicercaCurriculum = await Curriculum.findOne({
    codiceProfessionista: req.body.idprofessionista,
  });
  console.log(RicercaCurriculum);
  if (!!RicercaCurriculum) res.json({ ris: 1, RicercaCurriculum });
  else res.json({ ris: 2 });
});

router.post("/assistenza", async (req, res) => {});
router.post("/aggiorna-profilo", auth, async (req, res) => {
  const profiloDaAggiornare = await Cliente.findOne({ _id: req.user._id });
  profiloDaAggiornare.nome = req.body.nome;
  profiloDaAggiornare.cognome = req.body.cognome;
  profiloDaAggiornare.codicepostale = req.body.cap;
  profiloDaAggiornare.number = req.body.numero;
  await profiloDaAggiornare.save();

  res.json({ message: "ok" });
});

router.post("/infocliente", auth, async (req, res) => {
  const clienteInfo = await Cliente.findOne({ _id: req.user._id });
  if (!!clienteInfo) res.json(clienteInfo);
});

router.post("/info-appuntamento", async (req, res) => {
  const appuntamento = await Appuntamento.findOne({
    id_conversazione: req.body.id_conversazione,
  });
  res.json(appuntamento);
});

router.post("/lista-appuntamenti", auth, async (req, res) => {
  const listaAppuntamenti = await Appuntamento.find({
    id_cliente: req.user._id,
  });
  if (!!listaAppuntamenti) res.json(listaAppuntamenti);
  else res.json({ no: "ko" });
});

router.post("/accettaofferta", async (req, res) => {
  const appuntamento = await Appuntamento.findOne({
    _id: req.body.idappuntamento,
  });
  appuntamento.conferma = 1;
  await appuntamento.save();
  res.json({ messagge: "Accettato" });
});

router.post("/rifiutaofferta", async (req, res) => {
  const appuntamento = await Appuntamento.findOne({
    _id: req.body.idappuntamento,
  });
  appuntamento.conferma = 2;
  await appuntamento.save();

  res.json({ message: "Rifiutato" });
});

router.post("/nuovo-contatto", auth, async (req, res, next) => {
  const ceContatto = await Contatto.findOne({
    id_professionista: req.body.id_professionista,
    id_cliente: req.user._id,
  });
  if (ceContatto !== null) {
    console.log(ceContatto);

    res.send(ceContatto);
  } else {
    const nuovoContatto = await new Contatto({
      id_professionista: req.body.id_professionista,
      id_cliente: req.user._id,
    });

    await nuovoContatto.save();
    console.log(nuovoContatto);
    res.send(nuovoContatto);
  }
});

router.post("/inserisci-feedback", async (req, res) => {
  const nuovoFeedback = new Feedback({
    id_professionista: req.body.id_professionista,
    voto: req.body.voto,
  });

  const prof = await Professionista.findOne({
    _id: req.body.id_professionista,
  });

  const message = {
    from: "amministrazione@fastcura.com",
    to: prof.email,
    subject: "Nuovo Feedback",
    text: "Ciao ${prof.nome} ${prof.cognome}, hai ricevuto un nuovo feedback su Fastcura.it",
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });

  console.log(nuovoFeedback);

  await nuovoFeedback.save();
});

router.post("/mail-utente", async (req, res) => {
  const emailUtente = await Cliente.findOne({
    email: req.body.email.toLowerCase(),
  });
  console.log("TEST", emailUtente);
  res.json({ risult: !!emailUtente ? true : false });
});

router.post("/ottieni-feedback", async (req, res) => {
  const professionistaFeedback = await Feedback.find({
    id_professionista: req.body.id_professionista,
  });
  res.json(professionistaFeedback);
});

module.exports = router;
