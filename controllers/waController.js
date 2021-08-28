'use strict'

const { Client, MessageMedia } = require('whatsapp-web.js')
const axios = require('axios') 

const fs = require('fs')
const mime = require('mime-types')

const config = require('../config')
const { phoneNumberFormatter } = require('../helpers/formatter')

const cek = require('../function/cek')

const { shortlink, formatBytes } = require('../function/func')
const start = require('../function/info')
const { help } = require('../function/help')

const { qrcode } = require('../function/qrcode')
const { y2mp3, y2mp4 } = require('../function/y2mate')
const { ytmp3, ytmp4 } = require('../function/ytdl')
const { ytplay } = require('../function/ytplay')
const { carbon } = require('../function/carbon')
const { faktaunik } = require('../function/faktaunik')
const { sticker } = require('../function/sticker')

const pmpermit = require('../function/pmpermit')

const developer = "https://wa.me/6289677249060"

const puppeteerOptions = {
  headless: true,
  args: ["--no-sandbox"],
};

const sessionData = JSON.parse(config.wa_sessionid);

const client = new Client({
  puppeteer: puppeteerOptions,
  ffmpegPath: "ffmpeg",
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
  const filename = new Date().getTime();
  let fullFilename

  msg.downloadMedia().then(media => {
    if (media) {
      const mediaPath = './public/';

      if (!fs.existsSync(mediaPath)) {
        fs.mkdirSync(mediaPath);
      }

      const extension = mime.extension(media.mimetype);
      filename = filename + '.' + extension
      fullFilename = mediaPath + filename;

      try {
        fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' }); 
      } catch (err) {
        console.log('Failed to save the file:', err);
      }
      return filename
    }
  })
}

// await banned(sender)
async function banned(sender){
  await cek.buatBanned(sender)
  await client.sendMessage(sender, `Maaf, kamu telah melanggar rules dan kami dengan berat hati *membanned* kamu dari bot ini. Hubungi ${developer} untuk membuka banned`)
}

async function msgHandler(msg){
  let sender = msg.from
  let b = msg.body
  let isGroup = sender.endsWith('@g.us')
  let args = msg.body.trim().split(/ +/).slice(1)
  const chat = await msg.getChat()
  
  console.log(b)

  if(!isGroup){ // BUKAN GROUP CHAT

    // if(await cek.isLimit(msg.from.split("@")[0])){
    //   await client.sendMessage(msg.from, `*✋ Stop*\n\nMaaf, limit harian kamu sudah habis.\nGunakan perintah *${perintah.tambah_limit}* untuk menambah limit harianmu.`)
    //   return
    // }

    if(await cek.isBanned(msg.from.split("@")[0])){
      await client.sendMessage(msg.from, `*✋ Stop*\n\nMaaf, kamu telah terbanned. Hubungi ${developer} untuk membuka banned.`)
      return
    }

    cek.tambahLimit(msg.from.split("@")[0])

    if (b.startsWith("!ytmp3")) { // YouTube to MP3 Downloader
      await ytmp3(client, msg, args)
      return
    }

    if (b.startsWith("!ytmp4")) { // YouTube to MP4 Downloader
      await ytmp4(client, msg, args)
      return
    }

    if (b.startsWith("!y2mp3")) { // Youtube to MP3 Downloader server y2mate.com
      await y2mp3(client, msg, args)
      return
    }

    if (b.startsWith("!y2mp4")) { // Youtube to MP4 Downloader server y2mate.com
      await y2mp4(client, msg, args)
      return
    }

    if (b.startsWith("!faktaunik")) { // Memberikan fakta unik secara random
      await faktaunik(client, msg, args)
      return
    }

    if (b.startsWith("!sticker")) { // Membuat stiker dari gambar/image
      await sticker(client, msg, args)
      return
    }

    if (b.startsWith("!carbon")) { // Carbon || Ubah Text menjadi gambar
      await carbon(client, msg, args)
      return
    }

    if (b.startsWith("!qr")) { // QR Code Generator
      await qrcode(client, msg, args)
      return
    }

    if (b.startsWith("!play")) { // Play music from Youtube
      await ytplay(client, msg, args)
      return
    }

    if (b.startsWith("!brainly")) { // Brainly Scraper
      const brainly = require('brainly-scraper')

      var pertanyaan = msg.body.split('!brainly ')[1]
      console.log("pertanyaan: ", pertanyaan)
      brainly(pertanyaan).then(res => {
        res.data.forEach( x => {
          chat.sendMessage(`*Pertanyaan:* \n${x.pertanyaan}\n\n*Jawaban:* \n${x.jawaban[0].text}`)
        })
      });
    }

    if (b.startsWith("!glow")) {
      const puppeteer = require("puppeteer")
      msg.reply("sebentarr.. kita proses dulu")
      var h = msg.body.split("!glow ")[1];
  
      try{
        (async () => {
          const browser = await puppeteer.launch({
            headless: false,
          })
          const page = await browser.newPage();
          await page
            .goto("https://en.ephoto360.com/advanced-glow-effects-74.html", {
              waitUntil: "networkidle2",
            })
            .then(async () => {
              await page.type("#text-0", h);
              await page.click("#submit");
              await new Promise(resolve => setTimeout(resolve, 10000));
              try {
                await page.waitForSelector("#link-image");
                const element = await page.$("div.thumbnail > img");
                const text = await (await element.getProperty("src")).jsonValue();
      
                try {
                  const media = MessageMedia.fromUrl(text)
                  client.sendMessage(msg.from, await media)                  
                } catch (e) {
                  console.log(e)
                  msg.reply(text)
                }
                
                browser.close();
              } catch (error) {
                console.log(error);
                msg.reply(`Aku gk mau buatin, jangan paksa aku mas`)
              }
            })
            .catch((err) => {
              console.log(error);
              msg.reply(`Aku gk mau buatin, jangan paksa aku mas`)
            });
        })();
      } catch(err) {
        msg.reply(`Aku gk mau buatin, jangan paksa aku mas`);
      }
    }
    
    if (b.startsWith("!help")) { // help function
      await help(client, msg, args)
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