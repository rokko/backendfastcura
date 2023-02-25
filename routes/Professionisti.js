const express = require("express");
const Professionista = require("../models/Professionista");
const Appuntamento = require("../models/Appuntamento");
const Abbonamento = require("../models/Abbonamento");
const Curriculum = require("../models/Curriculm");
const Cliente = require("../models/Clienti");
const Contatto = require("../models/Contatti");
const auth = require("../middlewares/login");
const multer = require("multer");
const router = express();
const Avatar = require("../models/Avatar");
const nodemailer = require("nodemailer");
const axios = require("axios");
const AUTH_KEY = "SMSHYNKB0M680LLB7FYP3";
const AUTH_SECRET = "4V6P901A2SDISL4X9UPG0NGYT57N57H6";
const text = require("textbelt");

let transporter = nodemailer.createTransport({
  service: "Outlook365",
  auth: {
    user: "amministrazione@fastcura.com",
    pass: "Amlodipina.1",
  },
});

router.post("/password", async (req, res) => {
  const utente = await Professionista.findOne({ email: req.body.email });
  console.log(utente);
  if (!!utente) {
    console.log("entrato");
    const message = {
      from: "amministrazione@fastcura.com",
      to: utente.email,
      subject: "Recupero Password FASTCURA",
      text: `Salve ${utente.nome} la sua ultima password è ${utente.password}`,
    };
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
    res.json({ risposta: "Richiesta Inviata" });
  } else {
    console.log("entrato 2");
    const cliente = await Cliente.findOne({ email: req.body.email });
    console.log(cliente);
    if (!!cliente) {
      const message = {
        from: "amministrazione@fastcura.com",
        to: cliente.email,
        subject: "Recupero Password FASTCURA",
        text: `Salve ${cliente.nome} la sua ultima password è ${cliente.passw}`,
      };
      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });
      res.json({ risposta: "Richiesta Inviata" });
    } else res.json({ risposta: "Email inesistente" });
  }
});

router.post("/assistenza", async (req, res) => {
  const message = {
    from: "amministrazione@fastcura.com",
    to: "amministrazione@fastcura.com",
    subject: "Assistenza",
    text: `Cliente : ${req.body.nome} ${req.body.cognome} email : ${req.body.email} richiesta${req.body.richiesta}`,
  };
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });

  res.json({ risposta: "Richiesta assistenza inviata" });
});

router.post("/pro", auth, async (req, res) => {
  const profes = await Professionista.findOne({
    id_professionista: req.user._id,
  });
  if (!!profes) res.json({ ris: 0 });
  else res.json({ ris: 1 });
});
router.post("/ottieni-contatti", auth, async (req, res, next) => {
  const contatti = await Contatto.find({ id_professionista: req.user._id });
  res.send(contatti);
});

router.post("/recupera-avatar", async (req, res) => {
  const avatar = await Avatar.findOne({
    id_professionista: req.body.id_professionista,
  });
  if (avatar) {
    res.json({ message: 1, avatar });
  } else {
    res.json({ message: 0 });
  }
});
router.post("/inserisci-avatar", auth, async (req, res) => {
  const avatar = await Avatar.findOne({ id_professionista: req.user._id });
  console.log(req.body);
  if (avatar) {
    avatar.posizione = req.body.url;
    await avatar.save();
    res.json({ message: "Salvato", avatar });
  } else {
    const nuovoAvatar = await new Avatar({
      id_professionista: req.user._id,
      posizione: req.body.url,
    });
    await nuovoAvatar.save();

    res.json({ message: "Nuovo", nuovoAvatar });
  }
});

router.post("/avatar", auth, async (req, res) => {
  const avatar = await Avatar.findOne({
    id_professionista: req.user._id,
  });

  if (avatar) return res.json({ message: 1, avatar });
  else return res.json({ message: 0 });
});

router.post("/find-avatar", async (req, res) => {
  const avatar = await Avatar.findOne({
    id_professionista: req.body.id_professionista,
  });

  if (avatar) return res.json({ message: 1, avatar });
  else return res.json({ message: 0 });
});
router.post("/info-cliente", async (req, res) => {
  console.log(req.body.id_cliente);
  const clienteInfo = await Cliente.findOne({ _id: req.body.id_cliente });
  res.send(clienteInfo);
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const nuovoProfessionista = new Professionista({
    nome: req.body.nome,
    cognome: req.body.cognome,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    datadinascita: req.body.data,
    sesso: req.body.sesso,
    citta: req.body.citta,
    number: req.body.cellulare,
    professione: req.body.professione,
    greenpass: req.body.greenpass,
    referenze: req.body.referenze,
    annitalia: req.body.anni,
    esperienza: req.body.anniEsperienza,
    motivotermine: req.body.terminelavoro,
    livelloitaliano: req.body.livelloItaliano,
    titolodistudio: req.body.titoloStudio,
    possessodilaurea: req.body.possessodilaurea,
    numeroiscrizione: req.body.numeroiscrizione,
    assicurato: req.body.assicurato,
    precedente: req.body.precedente,
    dataIscrizione: new Date(),
  });
  const utenteSalvato = await nuovoProfessionista.save();
  const axios = require("axios");
  axios
    .post("https://textbelt.com/text", {
      phone: `+39${req.body.cellulare}`,
      message:
        "Benvenuto nella fastcura family😄. Da ora preparati perché le tue giornate saranno ricche di appuntamenti! Per qualsiasi dubbio non esitare a contattarci 🙂",
      key: "4288d1e08d4acffcc621a78ebba58da8a61c9742sxfNo2GI00S9DSnzm5pqZ2tnT",
    })
    .then((response) => {
      console.log(response.data);
    });
  axios
    .post("https://textbelt.com/text", {
      phone: `+393467331448`,
      message: `L'utente ${req.body.nome} ${req.body.cognome} cell ${req.body.cellulare}`,
      key: "4288d1e08d4acffcc621a78ebba58da8a61c9742sxfNo2GI00S9DSnzm5pqZ2tnT",
    })
    .then((response) => {
      console.log(response.data);
    });
  const message = {
    from: "amministrazione@fastcura.com",
    to: req.body.email,
    subject: "Iscrizione FASTCURA",
    text: "Ti diamo il Benvenuto su Fastcura.it , vieni sul nostro sito inserisci il tuo curriculum e amplia il tuo mercato",
  };
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  res.json({ result: "ok", message: utenteSalvato });
});
router.post("/nomecliente", async (req, res) => {
  console.log(req.body.idcliente);
  const infoCliente = await Cliente.findOne({
    _id: req.body.idcliente.idcliente,
  });
  const infoProfessionista = await Professionista.findOne({
    _id: req.body.idcliente.idcliente,
  });
  if (infoCliente != null)
    res.json({ nome: infoCliente.nome, cognome: infoCliente.cognome });
  else
    res.json({
      nome: infoProfessionista.nome,
      cognome: infoProfessionista.cognome,
    });
});
router.post("/ricerca", async (req, res) => {
  const listaProfessionista = await Professionista.find({
    citta: req.body.citta,
    professione: req.body.professione,
  });
  res.json({ message: "ok", professionisti: listaProfessionista });
});
router.post("/crea-appuntamento", async (req, res) => {
  const nuovoAppuntamento = await new Appuntamento({
    nome: req.body.nome,
    data: req.body.data,
    id_cliente: req.body.id_cliente,
    id_professionista: req.body.id_professionista,
    metodo_pagamento: req.body.metodo_pagamento,
    totale: req.body.totale,
    conferma: req.body.conferma,
    id_conversazione: req.body.id_conversazione,
  });

  const salvaAppuntamento = await nuovoAppuntamento.save();

  res.json({ message: "ok", appuntamento: salvaAppuntamento });
});

router.post("/modifica-abbonamento", auth, async (req, res, next) => {
  const abbonamentoDaModificare = await Abbonamento.findOne({
    id_professionista: req.user._id,
  });

  res.json({ ok: "ok" });
});
router.post("/lasciarecensione", async (req, res) => {});

router.get("/lista-appuntamenti", auth, async (req, res, next) => {
  const listaAppuntamenti = await Appuntamento.find({
    id_professionista: req.user._id,
  });
  if (!!listaAppuntamenti) res.json(listaAppuntamenti);
  else res.json({ no: "ko" });
});

router.get("/ottieni-curriculum", auth, async (req, res) => {
  const curriculum = await Curriculum.findOne({
    codiceProfessionista: req.user._id,
  });
  if (curriculum) {
    res.json(curriculum);
  } else {
    res.json({ data: 1 });
  }
});

router.post("/info", async (req, res, next) => {
  const utente = await Professionista.findOne({ _id: req.body.id_cliente });
  res.json(utente);
});
router.post("/info2", auth, async (req, res, next) => {
  const utente = await Professionista.findOne({ _id: req.user._id });
  res.json(utente);
});
router.post("/mail-utente", async (req, res) => {
  const emailUtente = await Professionista.findOne({ email: req.body.email });
  console.log("TEST", emailUtente);
  res.json({ risult: !!emailUtente ? true : false });
});

router.post("/mail", async (req, res) => {
  const emailUtente = await Professionista.findOne({
    email: req.body.email.toLowerCase(),
  });

  res.json({ risult: !!emailUtente ? true : false });
});
router.post("/modificacurriculum", auth, async (req, res, next) => {
  const curriculumDaAggiornare = await Curriculum.findOne({
    codiceProfessionista: req.user._id,
  });
  if (!!curriculumDaAggiornare) {
    curriculumDaAggiornare.titolodistudio = req.body.titolodistudio;
    curriculumDaAggiornare.master = req.body.master;
    curriculumDaAggiornare.numeroiscrizione = req.body.numeroOrdine;
    curriculumDaAggiornare.esperienze = req.body.esperienze;
    curriculumDaAggiornare.altro = req.body.altro;
    const salvaCurriculum = await curriculumDaAggiornare.save();

    res.json(salvaCurriculum);
    console.log("esistente");
  } else {
    const nuovoCurriculum = new Curriculum({
      altro: req.body.altro,
      master: req.body.master,
      esperienze: req.body.esperienze,
      titolodistudio: req.body.titolodistudio,
      numeroiscrizione: req.body.numeroOrdine,
      codiceProfessionista: req.user._id,
    });
    console.log("nuovo");

    const salvaNuovo = await nuovoCurriculum.save();
    res.json(salvaNuovo);
  }
});
router.get("/getAll", async (req, res) => {
  const listaUtenti = await Professionista.find();
  console.log(listaUtenti);
  res.json(listaUtenti);
});

module.exports = router;
