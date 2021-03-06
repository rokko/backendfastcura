const express = require("express");
const Cliente = require("../models/Clienti");
const Contatto = require("../models/Contatti");
const Curriculum = require("../models/Curriculm");
const Appuntamento = require("../models/Appuntamento");
const Feedback = require("../models/Feedback");
const router = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/login");

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "fastcura.responding@gmail.com",
    pass: "Accountprova1",
  },
});

router.post("/test", async (req, res) => {
  const message = {
    from: "from-example@email.com",
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

router.post("/signup", async (req, res) => {
  const cliente = await new Cliente({
    nome: req.body.nome,
    cognome: req.body.cognome,
    email: req.body.email,
    passw: req.body.password,
    sesso: req.body.sesso,
    data: req.body.data,
    codicepostale: req.body.cap,
    number: req.body.cellulare,
  });
  const message = {
    from: "fastcura.responding@gmail.com",
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
      from: "from-example@email.com",
      to: cliente.email,
      subject: "Modifica Password",
      text:
        "La modifica della password ?? avvenuta con successo, la tua nuova password ?? " +
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
  if (!!RicercaCurriculum) res.json({ ris: 1, RicercaCurriculum });
  else res.json({ ris: 2 });
});

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

  console.log(nuovoFeedback);

  await nuovoFeedback.save();
});

router.post("/ottieni-feedback", async (req, res) => {
  const professionistaFeedback = await Feedback.find({
    id_professionista: req.body.id_professionista,
  });
  res.json(professionistaFeedback);
});

module.exports = router;
