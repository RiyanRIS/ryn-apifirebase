const wa = require('../lib/wa')
const { readFileSync } = require('fs')

const help = async (sender, args, msg, b) => {
    const commands = `
🎀 *RiyanBot* 🎀\n
\n
🔥 *!ytmp3* - _Download lagu dari YouTube_\n
🔥 *!ytmp4* - _Download video dari YouTube_\n
🔥 *!y2mp3* - _Download lagu dari YouTube(server y2mate)_\n
🔥 *!y2mp4* - _Download video dari YouTube(server y2mate)_\n
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
            try {
                await wa.sendImage(sender, readFileSync("./src/ocr.jpg"), `*Optical Character Recognition*\n\nPengenalan karakter optik dapat mengubah gambar menjadi teks. Cukup dengan memberi caption _*!ocr*_ pada gambar yang ingin discan.`)
            } catch (error) {
                console.error(error)
            }
            return
        }

        if (param == "carbon") {
            msg.reply(`*Carbon*\n\nGenerate gambar keren dengan carbon.now.sh. Kirim teks yang ingin kamu jadikan gambar.\n\n*!carbon [Text]*\natau,\nTag pesan dengan menyertakan *!carbon* untuk mentriger`)
        }
        
        if (param == "qr") {
            msg.reply(`*QR Kode*\n\nGenerate QR kode dari kalimat/link yang kamu kasih.\n\n*!qr [Text]*\natau,\nTag pesan yang ingin kamu ubah menjadi Qr kode dengan menyertakan *!qr* untuk mentriger`)
        }
        
        if (param == "cricket") {
            msg.reply(`*Cricket*\n\nGet cricket updates in a schedule.\n\nSend a message with\n*!cricket [Cribuzz-Url] [Interval-Time]m [Stop-Time]m* to execute.\n\n*Example:* If you want to get updates in every 2 minutes for 15 minutes then the command will be:\n\n!cricket https://www.cricbuzz.com/xyz 2m 15m\n\nTo stop updates before your stop time execute !cricketstop\n\nYou can set only one cricket update in a single chat (Group / Brodcast / Private)`)
        }

    }

    msg.reply(commands)
}

module.exports = {
    help
}
