'use strict'

const { Client, MessageMedia } = require('whatsapp-web.js')
const axios = require('axios')

const fs = require('fs')
const mime = require('mime-types')

const config = require('../config')
const { phoneNumberFormatter } = require('../helpers/formatter')

const perintah = require('../src/perintah')
const cek = require('../function/cek')

const start = require('../function/info')
const help = require('../function/help')
const qr = require('../function/qr')
const yttomp3 = require('../function/yttomp3')
const carbon = require('../function/carbon')
const pmpermit = require('../function/pmpermit')

const { createWriteStream } = require("fs");

const developer = "https://wa.me/6289677249060"

const puppeteerOptions = {
  headless: true,
  args: ["--no-sandbox"],
};

let sessionData = JSON.parse(config.wa_sessionid);

const client = new Client({
  puppeteer: puppeteerOptions,
  session: sessionData
});

client.initialize();

client.on('auth_failure', msg => {
  console.error("There is a problem in authentication, Kindly set the env var again and restart the app");
});

client.on('ready', () => {
  console.log('Bot has been started');
});

/**
* 
* Kumpulan Fungsi-Fungsi
* 
*/

//  await sendMedia(sender, caption, url_gambar)
async function sendMedia(number, caption, fileUrl) {
  let mimetype;
  const attachment = await axios.get(fileUrl, {
    responseType: 'arraybuffer'
  }).then(response => {
    mimetype = response.headers['content-type'];
    return response.data.toString('base64');
  });

  const media = new MessageMedia(mimetype, attachment, 'Media');

  client.sendMessage(number, media, {
    caption: caption
  }).catch(err => {
    console.error("gagal kirim gambar ke: " + sender, err)
  });
}

async function downloadMedia(msg){
  msg.downloadMedia().then(media => {

    if (media) {
      const mediaPath = './public/';

      if (!fs.existsSync(mediaPath)) {
        fs.mkdirSync(mediaPath);
      }

      const extension = mime.extension(media.mimetype);
      
      const filename = new Date().getTime();
      const fullFilename = mediaPath + filename + '.' + extension;

      try {
        fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' }); 
      } catch (err) {
        console.log('Failed to save the file:', err);
      }
    }
  });
}

// await banned(sender)
async function banned(sender){
  await cek.buatBanned(sender)
  await client.sendMessage(sender, `Maaf, kamu telah melanggar rules dan kami dengan berat hati *membanned* kamu dari bot ini. Hubungi ${developer} untuk membuka banned`)
}

async function msgHandler(msg){
  let sender = msg.from
  let body = msg.body
  var isGroup = sender.endsWith('@g.us')

  console.log(body)

  if(!isGroup){ // BUKAN GROUP CHAT

    if(await cek.isLimit(sender.split("@")[0])){
      await client.sendMessage(sender, `*✋ Stop*\n\nMaaf, limit harian kamu sudah habis.\nGunakan perintah *${perintah.tambah_limit}* untuk menambah limit harianmu.`)
      return
    }

    if(await cek.isBanned(sender.split("@")[0])){
      await client.sendMessage(sender, `*✋ Stop*\n\nMaaf, kamu telah terbanned. Hubungi ${developer} untuk membuka banned.`)
      return
    }

    cek.tambahLimit(sender.split("@")[0])	

    if (msg.body.startsWith("!yttomp3")) { // YouTube to MP3 Downloaded
      
      var search = await yttomp3.search(msg)

      msg.reply(search.pesan)

      if(search.status){
        try{
          search.stream.on("finish", () => {
            var path = __dirname + `/../public/${search.title}.mp3`
            var stats = fs.statSync(path)
            if(stats.size > 99999999){ // Jika ukuran file lebih dari 100MB
              var url_download = config.url + "/public/" + search.title + ".mp3"
              msg.reply(`🙇‍♂️ Ukuran file terlalu besar \n\nSilahkan download melalui link berikut 👇\n${url_download}`)
            } else {
              const media = MessageMedia.fromFilePath(path)
              msg.reply(media)
            }
          })
        } catch (e) {
          msg.reply(`*⛔ Maaf*\n\nTerjadi kesalahan pada sistem kami..`)
        }
      }
      return
    }

    if (msg.body.startsWith("!carbon")) { // Carbon || Ubah Text menjadi gambar
      
      var text

      if(msg.hasQuotedMsg){
        var quotedMsg = await msg.getQuotedMessage()
        text = quotedMsg.body
      }else{
        text = msg.body.replace("!carbon ", "")
      }

      await carbon.mainF(text)
      .then(function (response) {
        try {
          client.sendMessage(msg.from, new MessageMedia("image/png", Buffer.from(response.data).toString('base64'),"carbon.png"), { caption: `Hasil untuk 👇\n` + "```" + text + "```" })
        } catch (error) {
          msg.reply(`*⛔ Maaf*\n\n` + "```Terjadi kesalahann pada saat memproses data.```")
        }
      })
      .catch(function (error) {
        msg.reply(`*⛔ Maaf*\n\n` + "```Terjadi kesalahan pada saat memproses data.```")
      })

      return

    }

    if (msg.body.startsWith("!qr")) { // QR Code Generator
      
      var text

      if(msg.hasQuotedMsg){
        var quotedMsg = await msg.getQuotedMessage()
        text = quotedMsg.body
      }else{
        text = msg.body.replace("!qr ", "")
      }

      var data = await qr.qrgen(text);
      client.sendMessage(msg.from, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `QR code for 👇\n` + "```" + text + "```" });
      return
    } 
    
    if (msg.body.startsWith("!help")) { // help function
      var data = await help.mainF(msg.body)
      msg.reply(data)
      return
    }

    if (msg.body.includes("!info")) {
      var startdata = await start.get(await client.info.getBatteryStatus(), client.info.phone)
      msg.reply(startdata.msg)
      return
    }

    if (msg.body == "!ping") { // Ping command
      msg.reply("Pong !!!")
      return
    }
  }
}

client.on('message', async msg => {

  await msgHandler(msg)
});

client.on('message_create', async (msg) => {
  // if (msg.hasMedia) {
  //   await downloadMedia(msg)
  // }

  if (msg.fromMe) {
    if (msg.body == "!allow" && !msg.to.includes("-")) { // allow and unmute the chat (PMPermit module)
        pmpermit.permitacton(msg.to.split("@")[0])
        var chat = await msg.getChat();
        await chat.unmute(true)
        msg.reply("Allowed for PM")

    }
  }
});

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
        response: err,
        asu: ["Lha kok error"]
      });
    });
  }else{
    res.status(401).json({
      status: false,
      response: ["Kunci salah, silahkan hubungi pengembang untuk mendapat kunci"]
    });
  }
}


module.exports = {
    send,
}