// https://github.com/fent/node-ytdl-core

const YTDL = require("ytdl-core");
const { statSync, createWriteStream } = require("fs");
const config = require("../config")
const { shortlink, formatBytes } = require("./func")
const { MessageMedia } = require('whatsapp-web.js')

async function ytmp3(client, msg, args) {
  
  if(!YTDL.validateURL(args[0])){
    msg.reply(`*⛔ Maaf*\n\nUrl video tidak valid atau kami tidak menemukan apapun!`)
    return
  }

  const chat = await msg.getChat()
  const filename = new Date().getTime()
  const path = `./public/${filename}.mp3`

  const videoID = YTDL.getURLVideoID(args[0])
  const info = await YTDL.getInfo(videoID)

  msg.reply(`*⏳ Tunggu Sebentar*\n\nDownload musik sedang kami proses.`)

  let stream = YTDL(args[0], {quality: 'highestaudio', format: 'audioonly'})

  let simp = createWriteStream(path);
  let simpen = stream.pipe(simp)

  simpen.on("finish", async () => {
    let stats = statSync(path)
    let url_download = config.url + "/public/"+ filename + ".mp3"

    msg.reply(`*🙇‍♂️ Berhasil*\n\n*Judul:* ${info.videoDetails.title}\n*Size:* ${formatBytes(stats.size)}\n\n*Link:* ${await shortlink(url_download)}`)

    if(stats.size < 29999999){ // jika ukuran file kurang dari 30 mb
      const musiknya = MessageMedia.fromFilePath(path)
      chat.sendMessage(musiknya)
    }
  });

  simpen.on("error", (e) => {
    console.log(e)
    msg.reply(`*⛔ Maaf*\n\nTerjadi kesalahan pada server kami!`)
  })
}

async function ytmp4(client, msg, args) {

  if(!YTDL.validateURL(args[0])){
    msg.reply(`*⛔ Maaf*\n\nUrl video tidak valid atau kami tidak menemukan apapun!`)
    return
  }

  const chat = await msg.getChat()
  let videoID = YTDL.getURLVideoID(args[0])
  let info = await YTDL.getInfo(videoID)

  msg.reply(`*⏳ Tunggu Sebentar*\n\nDownload video sedang kami proses.`)

  let stream = YTDL(args[0], {quality: 'highest', format: 'audioandvideo'})

  const filename = new Date().getTime()
  let path = `./public/${filename}.mp4`

  let simp = createWriteStream(path);
  let simpen = stream.pipe(simp)

  simpen.on("finish", async () => {
    
    let stats = statSync(path)
    let url_download = config.url + "/public/"+ filename + ".mp4"

    msg.reply(`*🙇‍♂️ Berhasil*\n\n*Judul:* ${info.videoDetails.title}\n*Size:* ${formatBytes(stats.size)}\n\n*Link:* ${await shortlink(url_download)}`)

    if(stats.size < 29999999){ // jika ukuran file kurang dari 30 mb
      const musiknya = MessageMedia.fromFilePath(path)
      chat.sendMessage(musiknya)
    }
  });

  simpen.on("error", (e) => {
    console.log(e)
    msg.reply(`*⛔ Maaf*\n\nTerjadi kesalahan pada server kami!`)
  })
}

module.exports = {
  ytmp3, ytmp4
}