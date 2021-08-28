const fs = require("fs")
const mime = require('mime-types')
const { MessageMedia } = require('whatsapp-web.js')

const sticker = async (client, msg, args) => {
  if(msg.hasQuotedMsg){

    var quotedMsg = await msg.getQuotedMessage()
    if (quotedMsg.hasMedia) {

      const filename = new Date().getTime()

      quotedMsg.downloadMedia().then(media => {
        if (media) {
          const mediaPath = './public/'

          if (!fs.existsSync(mediaPath)) {
            fs.mkdirSync(mediaPath)
          }

          const extension = mime.extension(media.mimetype)
          let fullFilename = mediaPath + filename + '.' + extension

          try {
            fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' })

          } catch (err) {
            console.log('Failed to save the file:', err)
          }

          const stickerMedia = MessageMedia.fromFilePath(fullFilename)
          client.sendMessage(msg.from, stickerMedia, { sendMediaAsSticker: true })
          return
        }
      })
    } else {
      msg.reply(`*⛔ Maaf*\n\nKami belum mendapatkan imagenya, gunakan _!help stiker_ untuk melihat detail perintah!`)
      return
    }
  } else {
    msg.reply(`*⛔ Maaf*\n\nKami belum mendapatkan imagenya, gunakan _!help stiker_ untuk melihat detail perintah!`)
    return
  }
}

module.exports = {
  sticker
}