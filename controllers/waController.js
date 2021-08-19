'use strict';

const { Client } = require('whatsapp-web.js');

const config = require('../config');
const { phoneNumberFormatter } = require('../helpers/formatter');

let sessionData = JSON.parse(config.wa_sessionid);
const client = new Client({
  session: sessionData
});

client.on('authenticated', (session) => {
  console.log("Whatsapp is authenticated!");
});

client.on('ready', () => {
  console.log("Client is ready!");
});

const cek = (req, res, next) => {
  const key = req.headers.key

  if(key == config.key){

    client.on('authenticated', (session) => {
      console.log("Whatsapp is authenticated!");
    });

    client.on('ready', () => {
      console.log("Client is ready!");
    });

    res.status(200).send("Done, check your server's console.");
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