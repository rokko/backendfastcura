const express = require('express')
const Contatto = require('../models/Contatti')
const Message = require('../models/Message')
const auth = require('../middlewares/login')
const router = express()

router.post('/get-message',  async(req,res,next)=>{

    const listaMessaggi= await Message.find({contatti_id:req.body.contatti_id})
    res.send(listaMessaggi)
    
})

router.post('/send-message',auth, async(req,res,next)=>{
    const nuovoMessaggio =await new Message({
        sender: req.user._id,
        contatti_id: req.body.contatti_id,
        message: req.body.message
    })

    await nuovoMessaggio.save()

    res.send(nuovoMessaggio)

})

module.exports=router