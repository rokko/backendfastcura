const express = require("express");
const Contatto = require("../models/Contatti");
const Message = require("../models/Message");
const Cliente = require("../models/Clienti");
const Professionista = require("../models/Professionista");
const auth = require("../middlewares/login");
const router = express();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "Outlook365",
  auth: {
    user: "amministrazione@fastcura.com",
    pass: "Amlodipina.1",
  },
});

router.post("/get-message", async (req, res, next) => {
  const listaMessaggi = await Message.find({
    contatti_id: req.body.contatti_id,
  });
  const messagginonletti = listaMessaggi.filter((x) => x.reader === false);
  messagginonletti.map(async (x) => {
    if (x.sender !== req.body.id) x.ricreader = true;
    await x.save();
  });

  res.send(listaMessaggi);
});

router.post("/ottieni-ultimo", async (req, res, next) => {
  const listaMessaggi = await Message.find({
    contatti_id: req.body.contatti_id,
  });
  res.send(listaMessaggi);
});

router.post("/send-message", auth, async (req, res, next) => {
  const nuovoMessaggio = await new Message({
    sender: req.user._id,
    contatti_id: req.body.contatti_id,
    message: req.body.message,
    sendreader: true,
    ricreader: false,
  });

  const contatto = await Contatto.findOne({ _id: req.body.contatti_id });
  console.log("CONTATTO", contatto);
  if (contatto.id_cliente === req.user._id) {
    const utenteDaRicevere = await Professionista.findOne({
      _id: contatto.id_professionista,
    });

    request.post(
      "https://textbelt.com/text",
      {
        form: {
          phone: cliente.number,
          message:
            "Ciao ,benvenuto su Fastcura.Se hai visitato il nostro sito è perché non te la passi bene.Stai tranquillo visita Fastcura.it troverai i migliori professionisti pronti ad aiutarti.E ricorda : nessun problema!Ci pensa Fastcura",
          key: "textbelt",
        },
      },
      (err, httpResponse, body) => {
        console.log(err);
        console.log(httpResponse);
        console.log(JSON.parse(body));
      }
    );
    const message = {
      from: "amministrazione@fastcura.com",
      to: utenteDaRicevere.email,
      subject: "Hai ricevuto un nuovo messaggio",
      text: `Ciao ${utenteDaRicevere.nome} ${utenteDaRicevere.cognome}  , ti è appena arrivato un messaggio su Fastcura , dai un'occhiata`,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  } else {
    const utenteDaRicevere = await Cliente.findOne({
      _id: contatto.id_cliente,
    });

    console.log("UTENTE", utenteDaRicevere);
    const message = {
      from: "amministrazione@fastcura.com",
      to: utenteDaRicevere.email,
      subject: "Hai ricevuto un nuovo messaggio",
      text: `Ciao ${utenteDaRicevere.nome} ${utenteDaRicevere.cognome}  , ti è appena arrivato un messaggio su Fastcura , dai un'occhiata`,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
  await nuovoMessaggio.save();

  res.send(nuovoMessaggio);
});

module.exports = router;
