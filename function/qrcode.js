const qr = require('qr-image')
const { MessageMedia } = require('whatsapp-web.js')

const qrcode = async (client, msg, args) => {
    var text

    if(msg.hasQuotedMsg){
      var quotedMsg = await msg.getQuotedMessage()
      text = quotedMsg.body
    }else{
      text = msg.body.replace("!qr ", "")
    }

    const data = ({
        mimetype: "image/png",
        data: await (qr.imageSync(text, { type: 'png' }).toString('base64')),
        filename: text + ".png"
    })

    client.sendMessage(msg.from, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `QR code for 👇\n` + "```" + text + "```" });
    return
}

module.exports = {
    qrcode
}