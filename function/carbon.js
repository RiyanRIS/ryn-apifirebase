const axios = require('axios')
const { MessageMedia } = require('whatsapp-web.js')

const carbon = async (client, msg, args) => {
  var text

  if(msg.hasQuotedMsg){
    var quotedMsg = await msg.getQuotedMessage()
    text = quotedMsg.body
  }else{
    text = msg.body.replace("!carbon ", "")
  }

  // Special thanks to Sumanjay for his carbon api
  var respoimage = await axios({
    method: 'post',
    url: 'https://carbonara.vercel.app/api/cook',
    data: {
      "code": text,
    },
    responseType: "arraybuffer",
  })

  try {
    client.sendMessage(msg.from, new MessageMedia("image/png", Buffer.from(respoimage.data).toString('base64'),"carbon.png"), { caption: `Hasil untuk 👇\n` + "```" + text + "```" })
  } catch (error) {
    msg.reply(`*⛔ Maaf*\n\n` + "```Terjadi kesalahann pada saat memproses data.```")
  }
  
}

module.exports = {
  carbon
}