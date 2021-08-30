// https://github.com/fent/node-ytdl-core

const YTDL = require("ytdl-core");
const config = require("../config")
const { shortlink, formatBytes, getRandomExt } = require("./func")

const { createWriteStream, readFileSync, statSync } = require('fs')
const wa = require('../lib/wa')

async function ytmp3(sender, args, msg) {
  
  if(!YTDL.validateURL(args[0])){
    await wa.reply(sender, `*⛔ Maaf*\n\nUrl video tidak valid atau kami tidak menemukan apapun!`, msg)
    return
  }

  const filename = getRandomExt(".mp3")
  const path = `./public/${filename}`

  const videoID = YTDL.getURLVideoID(args[0])
  const info = await YTDL.getInfo(videoID)

  wa.reply(sender, `*⏳ Tunggu Sebentar*\n\nDownload musik sedang kami proses.`, msg)

  let stream = YTDL(args[0], {quality: 'highestaudio', format: 'audioonly'})

  let simp = createWriteStream(path);
  let simpen = stream.pipe(simp)

  simpen.on("finish", async () => {
    let stats = statSync(path)
    let url_download = config.url + "/public/"+ filename

    await wa.reply(sender, `*🙇‍♂️ Berhasil*\n\n*Judul:* ${info.videoDetails.title}\n*Size:* ${formatBytes(stats.size)}\n\n*Link:* ${await shortlink(url_download)}`, msg)

    if(stats.size < 29999999){ // jika ukuran file kurang dari 30 mb
      const musiknya = readFileSync(path)
      await wa.sendAudio(sender, musiknya)
    }
  });

  simpen.on("error", (e) => {
    console.log(e)
    wa.reply(sender, `*⛔ Maaf*\n\nTerjadi kesalahan pada server kami!`, msg)
  })
}

async function ytmp4(sender, args, msg) {

  if(!YTDL.validateURL(args[0])){
    await wa.reply(sender, `*⛔ Maaf*\n\nUrl video tidak valid atau kami tidak menemukan apapun!`, msg)
    return
  }

  let videoID = YTDL.getURLVideoID(args[0])
  let info = await YTDL.getInfo(videoID)

  await wa.reply(sender, `*⏳ Tunggu Sebentar*\n\nDownload video sedang kami proses.`, msg)

  let stream = YTDL(args[0], {quality: 'highest', format: 'audioandvideo'})

  const filename = getRandomExt(".mp4")
  let path = `./public/${filename}`

  let simp = createWriteStream(path);
  let simpen = stream.pipe(simp)

  simpen.on("finish", async () => {
    
    let stats = statSync(path)
    let url_download = config.url + "/public/"+ filename

    await wa.reply(sender, `*🙇‍♂️ Berhasil*\n\n*Judul:* ${info.videoDetails.title}\n*Size:* ${formatBytes(stats.size)}\n\n*Link:* ${await shortlink(url_download)}`, msg)

    if(stats.size < 29999999){ // jika ukuran file kurang dari 30 mb
      const videonya = readFileSync(path)
      await wa.sendVideo(sender, videonya)
    }
  });

  simpen.on("error", (e) => {
    console.log(e)
    wa.reply(sender, `*⛔ Maaf*\n\nTerjadi kesalahan pada server kami!`, msg)
  })
}

module.exports = {
  ytmp3, ytmp4
}