async function mainF(text) {

    const commands = `
🎀 *RiyanBot* 🎀\n
\n
🔥 *!carbon* - _Membuat kode/kalimat jadi gambar keren_\n
🔥 *!yttomp3* - _Download lagu(mp3) dari link YouTube_\n
🔥 *!qr* - _Membuat QR kode dari text tertentu_\n
\n
🛡 _Nggak tidur selama 2 hari cuma buat ini doang, bangke_\n
\n
*!help [PERINTAH]* - Untuk melihat detail perintah yang tersedia`

    if (text == "!help") {
        return commands

    } else if (text.startsWith("!help ")) {
        var param = text.split(" ")[1]
        if (param == "yttomp3") {
            return `*YouTube to Mp3*\n\nDownload musik dari link youtube.\n\n*!yt [Link-YouTube]*\natau,\nTag pesan dengan menyertakan *!yt* untuk mentriger`
        }
        
        if (param == "carbon") {
            return `*Carbon*\n\nGenerate gambar keren dengan carbon.now.sh. Kirim teks yang ingin kamu jadikan gambar.\n\n*!carbon [Text]*\natau,\nTag pesan dengan menyertakan *!carbon* untuk mentriger`
        }
        
        if (param == "qr") {
            return `*QR Kode*\n\nGenerate QR kode dari kalimat/link yang kamu kasih.\n\n*!qr [Text]*\natau,\nTag pesan yang ingin kamu ubah menjadi Qr kode dengan menyertakan *!qr* untuk mentriger`
        }
        
        if (param == "cricket") {
            return `*Cricket*\n\nGet cricket updates in a schedule.\n\nSend a message with\n*!cricket [Cribuzz-Url] [Interval-Time]m [Stop-Time]m* to execute.\n\n*Example:* If you want to get updates in every 2 minutes for 15 minutes then the command will be:\n\n!cricket https://www.cricbuzz.com/xyz 2m 15m\n\nTo stop updates before your stop time execute !cricketstop\n\nYou can set only one cricket update in a single chat (Group / Brodcast / Private)`
        }

        return commands
    }
}


module.exports = {
    mainF
}
