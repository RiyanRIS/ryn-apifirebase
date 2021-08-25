const ScrapeYt = require("scrape-yt");
const YTDL = require("discord-ytdl-core");
const { createWriteStream } = require("fs");

async function search(msg, isQuoted = false) {
  let infos
  let stream
  let url
  let out

  if(msg.hasQuotedMsg){
    url = msg.body
  } else {
    if (!url) {
      out = ({
        status: false,
        pesan: `*⛔*\n\nKami belum menerima url video!\nGunakan \\help untuk melihat format perintah.`
      })
      return out
    }
  }

  try {
      infos = await ScrapeYt.search(url);
      stream = YTDL(url, { encoderArgs: ['-af','dynaudnorm=f=200'], fmt: 'mp3', opusEncoded: false }).pipe(createWriteStream(__dirname + `/../public/${infos[0].title}.mp3`))
  } catch (e) {
      out = ({
        status: false,
        pesan: `*⛔ Maaf*\n\nKami tidak menemukan hasil apapun untuk : ${url} !`
      })
      return out
  }
  out = ({
    status: true,
    title: infos[0].title,
    stream: stream,
    pesan: `*✋ Tunggu Sebentar*\n\nKami sedang memprosesnya...`
  })
  return out

}

async function send(stream, title){
  try {
    stream.pipe(createWriteStream(__dirname + `/../public/${title}.mp3`)).on('finish', () => {
      out = ({
        status: true,
        pesan: `Berhasil`
      })
      return out
    })
  }catch(e){
    out = ({
      status: false,
      pesan: `*⛔ Maaf*\n\nKesalahan teknis..`
    })
    return out
  }
}

module.exports = {
  search, send
}