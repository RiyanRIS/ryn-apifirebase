const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const connect = require('./connect');
const { getRandomExt } = require("../function/func");
const fs = require('fs')

const conn = connect.koneksi

exports.sendMessage = async(from, text) => {
  await conn.sendMessage(from, text, MessageType.text)
}

exports.reply = async(from, text, quoted) => {
  await conn.sendMessage(from, text, MessageType.text, { quoted: quoted });
}

// exports.sendAudio = async(from, buffer) => {
//   await conn.sendMessage(from, buffer, MessageType.mp4Audio, { mimetype: Mimetype.mp4Audio, ptt: true })
// }

exports.sendAudio = async(from, buffer) => {
  await conn.sendMessage(from, buffer, MessageType.audio)
}

exports.sendImage = async(from, buffer, caption = "") => {
  await conn.sendMessage(from, buffer, MessageType.image, { caption: caption })
}

exports.sendVideo = async(from, buffer, caption = "") => {
  await conn.sendMessage(from, buffer, MessageType.video, { caption: caption })
}

exports.sendSticker = async(from, buffer) => {
  await conn.sendMessage(from, buffer, MessageType.sticker)
}

exports.sendPdf = async(from, buffer, title = "hello.pdf") => {
  await conn.sendMessage(from, buffer, MessageType.document, { mimetype: Mimetype.pdf, title: title })
}

exports.sendGif = async(from, buffer) => {
  await conn.sendMessage(from, buffer, MessageType.video, { mimetype: Mimetype.gif })
}

exports.sendContact = async(from, nomor, nama) => {
  const vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + nama + '\n' + 'ORG:Kontak\n' + 'TEL;type=CELL;type=VOICE;waid=' + nomor + ':+' + nomor + '\n' + 'END:VCARD'
  await conn.sendMessage(from, { displayname: nama, vcard: vcard }, MessageType.contact)
}

exports.sendMention = async(from, text, mentioned) => {
  await conn.sendMessage(from, text, MessageType.text, { contextInfo: { mentionedJid: mentioned } })
}

exports.sendImageMention = async(from, buffer, text, mentioned) => {
  await conn.sendMessage(from, buffer, MessageType.image, { contextInfo: { mentionedJid: [mentioned], participant: [mentioned] }, caption: text })
}

exports.downloadMedia = async(media) => {
  const filePath = await conn.downloadAndSaveMediaMessage(media, `./public/${getRandomExt()}`)
  const fileStream = fs.createReadStream(filePath)
  const fileSizeInBytes = fs.statSync(filePath).size
  // fs.unlinkSync(filePath)
  return { size: fileSizeInBytes, stream: fileStream , filepath: filePath}
}

exports.blockUser = async(id, block) => {
  if (block) return await conn.blockUser(id, "add")
  await conn.blockUser(id, "remove")
}

exports.getGroupParticipants = async(id) => {
  var members = await conn.groupMetadata(id)
  var members = members.participants
  let mem = []
  for (let i of members) {                                                                                                                                                           
    mem.push(i.jid)                                                                                                                                                              
  }
  return mem                                                                                                                                                                   
}

exports.getGroupAdmins = async(participants) => {
  admins = []
  for (let i of participants) {
      i.isAdmin ? admins.push(i.jid) : ''
  }
  return admins
}

exports.getGroupInvitationCode = async(id) => {
  const linkgc = await conn.groupInviteCode(id)
  const code = "https://chat.whatsapp.com/" + linkgc
  return code
}

exports.sendKontak = (from, nomor, nama) => {
      const vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + nama + '\n' + 'ORG:Kontak\n' + 'TEL;type=CELL;type=VOICE;waid=' + nomor + ':+' + nomor + '\n' + 'END:VCARD'
      conn.sendMessage(from, {displayname: nama, vcard: vcard}, MessageType.contact)
}

exports.kickMember = async(id, target = []) => {
  const g = await conn.groupMetadata(id)
  const owner = g.owner.replace("c.us", "s.whatsapp.net")
  const me = conn.user.jid
  for (i of target) {
      if (!i.includes(me) && !i.includes(owner)) {
          await conn.groupRemove(id, [i])
      } else {
          await conn.sendMessage(id, "Not Premited!")
          break
      }
  }
}

exports.promoteAdmin = async(id, target = [], status = true) => {
  const g = await conn.groupMetadata(id)
  const owner = g.owner.replace("c.us", "s.whatsapp.net")
  const me = conn.user.jid
  for (i of target) {
      if (!i.includes(me) && !i.includes(owner)) {
        if(!status) {
          await conn.groupDemoteAdmin(id, [i])
        }else{
          await conn.groupMakeAdmin(id, [i])
        }
      } else {
          await conn.sendMessage(id, "Not Premited!")
          break
      }
  }
}

exports.getUserName = async(jid) => {
  const user = conn.contacts[jid]
  return user != undefined ? user.notify : ""
}

exports.getBio = async(mids) => {
  const pdata = await conn.getStatus(mids)
  if (pdata.status == 401) {
      return pdata.status
  } else {
      return pdata.status
  }
}

exports.getPictProfile = async(mids) => {
  try {
      var url = await conn.getProfilePicture(mids)
  } catch {
      var url = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  }
  return url
}