const { shortlink } = require("./func")
const axios = require("axios")

async function y2mp3(client, msg, args) {
  const url = `https://alfians-api.herokuapp.com/api/yta?url=${args[0]}`;
  axios.get(url).then( async (res) => {
    msg.reply(`*⏳ Tunggu Sebentar*\n\nDownload musik sedang kami proses.`)
    msg.reply(`*🙇‍♂️ Berhasil*\n\n*Judul:* ${res.data.title}\n*Size:* ${res.data.filesize}\n\n*Link:* ${await shortlink(res.data.result)}`)
  })
}

async function y2mp4(client, msg, args) {
  const url = `https://alfians-api.herokuapp.com/api/ytv?url=${args[0]}`;
  axios.get(url).then( async (res) => {
    msg.reply(`*⏳ Tunggu Sebentar*\n\nDownload video sedang kami proses.`)
    msg.reply(`*🙇‍♂️ Berhasil*\n\n*Judul:* ${res.data.title}\n*Size:* ${res.data.filesize}\n\n*Link:* ${await shortlink(res.data.result)}`)
  })
}

module.exports = {
  y2mp3, y2mp4
}