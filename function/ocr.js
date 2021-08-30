const fs = require("fs")
const exec = require("child_process").exec
const wa = require('../lib/wa')
const log = console.debug

const ocr = async (sender, args, msg) => {
  const media = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
  const hasil = await wa.downloadMedia(media)

  await recognize(hasil.filepath, {lang: 'eng+ind', oem: 1, psm: 3})
    .then(teks => {
      wa.reply(sender, teks.trim(), msg)
      fs.unlinkSync(hasil.filepath)
  })
  .catch(err => {
    wa.reply(sender, "OCR gagal", msg)
    console.error("OCR error: ", err)
    fs.unlinkSync(hasil.filepath)
  })
} 

function recognize(filename, config = {}) {
  const options = getOptions(config)
  const binary = config.binary || "tesseract"

  const command = [binary, `"${filename}"`, "stdout", ...options].join(" ")
  if (config.debug) log("command", command)

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (config.debug) log(stderr)
      if (error) reject(error)
      resolve(stdout)
    })
  })
}

function getOptions(config) {
  const ocrOptions = ["tessdata-dir", "user-words", "user-patterns", "psm", "oem", "dpi"]

  return Object.entries(config)
    .map(([key, value]) => {
      if (["debug", "presets", "binary"].includes(key)) return
      if (key === "lang") return `-l ${value}`
      if (ocrOptions.includes(key)) return `--${key} ${value}`

      return `-c ${key}=${value}`
    })
    .concat(config.presets)
    .filter(Boolean)
}

module.exports = {
  ocr,
}
