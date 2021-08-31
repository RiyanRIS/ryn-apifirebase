const qr = require('qr-image')
const wa = require('../lib/wa')

const qrcode = async (sender, args, msg, b) => {
    let text = b.replace("!qr ", "")

    const data = ({
        mimetype: "image/png",
        data: await (qr.imageSync(text, { type: 'png' })),
        filename: text + ".png"
    })

    await wa.sendImage(sender, data.data, `QR code for 👇\n` + "```" + text + "```");
    return
}

module.exports = {
    qrcode
}