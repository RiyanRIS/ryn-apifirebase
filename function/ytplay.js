// https://github.com/ytb2mp3/youtube-mp3-downloader

const YTDL = require("ytdl-core")
const YoutubeMp3Downloader = require("youtube-mp3-downloader")
const { MessageMedia } = require('whatsapp-web.js')

const ytplay = async (client, msg, args) => {

  const chat = await msg.getChat()
  let id = YTDL.getURLVideoID(args[0])
  const filename = new Date().getTime()

  msg.reply(`*⏳ Tunggu Sebentar*\n\nProses pembuatan audio sedang dalam proses.`)

  try{
    let YD = new YoutubeMp3Downloader({
        "ffmpegPath": "ffmpeg", 
        "outputPath": "./public",         // Where should the downloaded and en>
        "youtubeVideoQuality": "highest", // What video quality sho>
        "queueParallelism": 100,          // How many parallel down>
        "progressTimeout": 2000           // How long should be the>
    });
    
    YD.download(id, filename + ".mp3")
    
    YD.on("finished", function(err, data) {
      const musik = MessageMedia.fromFilePath(data.file);
      chat.sendMessage(musik);
    })

    YD.on("error", function(error) {
      console.log(error)
      msg.reply("⛔ Maaf*\n\nTerjadi kesalahan pada server kami!")
    })
  }
  catch (err){
    msg.reply('⛔ Maaf*\n\nTerjadi kesalahan pada server kami!')
  }
}

module.exports = {
  ytplay
}