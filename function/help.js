const wa = require('../lib/wa')
const { readFileSync } = require('fs')

const help = async (sender, args, msg, b) => {
    const commands = `
🎀 *RiyanBot* 🎀\n
\n
🔥 *!ytmp3* - _Download lagu dari YouTube_\n
🔥 *!ytmp4* - _Download video dari YouTube_\n
🔥 *!ocr* - _Mengubah gambar menjadi teks_\n
🔥 *!carbon* - _Mengubah teks menjadi gambar keren_\n
🔥 *!qr* - _Membuat QR kode dari text tertentu_\n
\n
🛡 _Nggak tidur selama 2 hari cuma buat ini doang, bangke_\n
\n
*!help [PERINTAH]* - Untuk melihat detail perintah yang tersedia`

    if (b.startsWith("!help ")) {
        if (args[0] == "ytmp3" || args[0] == "!ytmp3") {
            await wa.reply(sender, `*YouTube to Mp3*\n\nDownload audio dari YouTube menggunakan library node-ytdl-core.\n\n*!ytmp3 [Link-YouTube]*`)
            return
        }

        if (args[0] == "ytmp4" || args[0] == "!ytmp4") {
            await wa.reply(sender, `*YouTube to Mp3*\n\nDownload video dari YouTube menggunakan library node-ytdl-core.\n\n*!ytmp4 [Link-YouTube]*`)
            return
        }

        if (args[0] == "ocr" || args[0] == "!ocr") {
            await wa.sendImage(sender, readFileSync("./src/ocr.jpg"), `*Optical Character Recognition*\n\nPengenalan karakter optik dapat mengubah gambar menjadi teks. Cukup dengan memberi caption _*!ocr*_ pada gambar yang ingin discan.`)
            return
        }

        if (args[0] == "carbon" || args[0] == "!carbon") {
            await wa.reply(sender, `*Carbon*\n\nGenerate gambar keren dengan carbon.now.sh. Kirim teks yang ingin kamu jadikan gambar.\n\n*!carbon [Text]*\natau,\nTag pesan dengan menyertakan *!carbon* untuk mentriger`)
            return
        }

        if (args[0] == "qr" || args[0] == "!qr") {
            await wa.reply(sender, `*QR Kode*\n\nGenerate QR kode dari kalimat/link yang kamu kasih.\n\n*!qr [Text]*`)
            return
        }

    }

    await wa.reply(sender, commands)
}

module.exports = {
    help
}
