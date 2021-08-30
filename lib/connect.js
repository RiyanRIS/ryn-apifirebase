const { WAConnection } = require("@adiwajshing/baileys")
const config = require('../config')

const sessionData = JSON.parse(config.wa_sessionid)

const conn = new WAConnection()
exports.koneksi = conn

exports.sambungkan = async() => {
  conn.loadAuthInfo(sessionData)
  await conn.connect()
}
