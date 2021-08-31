const axios = require('axios')
const wa = require('../lib/wa')

const carbon = async (sender, args, msg, b) => {
  const text = b.replace("!carbon ", "")

  // Special thanks to Sumanjay for his carbon api
  const respoimage = await axios({
    method: 'post',
    url: 'https://carbonara.vercel.app/api/cook',
    data: {
      "code": text,
    },
    responseType: "arraybuffer",
  })

  try {
    await wa.sendImage(sender, Buffer.from(respoimage.data), `Hasil untuk 👇\n` + "```" + text + "```")
  } catch (error) {
    await wa.reply(sender, `*⛔ Maaf*\n\n` + "```Terjadi kesalahann pada saat memproses data.```", msg)
  }
  return
  
}

module.exports = {
  carbon
}