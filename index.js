'use strict';
const { Presence } = require('@adiwajshing/baileys')
const wa_konek = require("./lib/connect")
const wa = require("./lib/wa")

// Function
const { help } = require('./function/help')
const { ytmp3, ytmp4 } = require('./function/ytdl')
const { ocr } = require('./function/ocr')
const { carbon } = require('./function/carbon')
const { qrcode } = require('./function/qrcode')
const { twd } = require('./function/twd')

wa_konek.sambungkan()
const conn = wa_konek.koneksi

conn.on('close', async () => {
  await wa_konek.sambungkan()
})

conn.on('chat-update', async(cb) => {
  if (!cb.hasNewMessage || !cb.messages || (cb.key && cb.key.remoteJid == 'status@broadcast')) return
	const msg = cb.messages.all()[0]
  if(msg.key.fromMe) return
  const type = Object.keys(msg.message)[0]
  const b = msg.message.conversation || msg.message[type].caption || msg.message[type].text || ""
  const args = b.trim().split(/ +/).slice(1)
  const sender = msg.key.remoteJid
  await conn.chatRead (sender)
  await conn.updatePresence(sender, Presence.available) 
  const isGroup = sender.endsWith('@g.us')
  const content = JSON.stringify(msg.message)
  const isMedia = (type === 'imageMessage' || type === 'videoMessage')
  const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
  const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
  const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
  const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')

  if(isGroup){ // Jika group chat
    const groupMetadata = await conn.groupMetadata(sender)
    const groupMembers = groupMetadata.participants
    const groupAdmins = await wa.getGroupAdmins(groupMembers)
    const isAdmin = groupAdmins.includes(sender) || false
    const isBotAdmin = groupAdmins.includes(conn.user.jid) || false

  } else { // Jika bukan group chat
    if (b.startsWith("!ytmp3")) { // YouTube to MP3 Downloader
      await ytmp3(sender, args, msg)
      return
    }

    if (b.startsWith("!ytmp4")) { // YouTube to MP4 Downloader
      await ytmp4(sender, args, msg)
      return
    }

    if (b.startsWith('!ocr')) {
      await ocr(sender, args, msg, isQuotedImage, isMedia)
      return
    }

    if (b.startsWith('!carbon')) {
      await carbon(sender, args, msg, b)
      return
    }

    if (b.startsWith('!qr')) {
      await qrcode(sender, args, msg, b)
      return
    }

    if (b.startsWith('!help')) {
      await help(sender, args, msg, b)
      return
    }

    if (b.startsWith("!twd")) {
      await twd(sender, args, msg, b)
      return
    }

  }
})

