const ScrapeYt = require("scrape-yt");
const YTDL = require("discord-ytdl-core");
const { createWriteStream } = require("fs");

async function search(msg, isQuoted = false) {
  let args = msg.body.split(' ').slice(1);
  let infos;
  let stream;

  var out

  if(isQuoted){
    args[0] = msg.body
  } else {
    if (!args[0]) {
      out = ({
        status: false,
        pesan: `*⛔*\n\nKami belum menerima url video!\nGunakan \\help untuk melihat format perintah.`
      })
      return out
    }
  }

  
 
  try {
      infos = await ScrapeYt.search(args.join(" "));
      stream = YTDL(args.join(" "), { encoderArgs: ['-af','dynaudnorm=f=200'], fmt: 'mp3', opusEncoded: false }).pipe(createWriteStream(__dirname + `/../public/${infos[0].title}.mp3`))
  } catch (e) {
      out = ({
        status: false,
        pesan: `*⛔ Maaf*\n\nKami tidak menemukan hasil apapun untuk : ${args.join(" ")} !`
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