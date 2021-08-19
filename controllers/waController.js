'use strict';

const { Client } = require('whatsapp-web.js');

const config = require('../config');
const { phoneNumberFormatter } = require('../helpers/formatter');

let sessionData = JSON.parse(config.wa_sessionid);
const client = new Client({
  session: sessionData
});

const cek = (req, res, next) => {
  const key = req.headers.key

  if(key == config.key){
    // client.on('ready', () => {
    //   res.send("Client is ready!");
    // });
    client.on('authenticated', (session) => {
      res.status(200).send("Whatsapp is authenticated!");
    });
  } else {
    res.status(401).json({
      status: false,
      response: ["Kunci salah, silahkan hubungi pengembang untuk mendapat kunci"]
    });
  }
}

const send = async (req, res, next) => {
  const key = req.headers.key
  const number = phoneNumberFormatter(req.body.number);
  const message = req.body.message;

  if(key == config.key){
    client.sendMessage(number, message).then(response => {
      res.status(200).json({
        status: true,
        response: response
      });
    }).catch(err => {
      res.status(500).json({
        status: false,
        response: err
      });
    });
  }else{
    res.status(401).json({
      status: false,
      response: ["Kunci salah, silahkan hubungi pengembang untuk mendapat kunci"]
    });
  }
}

client.initialize();

module.exports = {
    send,
    cek,
}