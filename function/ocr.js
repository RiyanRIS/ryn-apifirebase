const fs = require("fs")
const mime = require('mime-types')
const exec = require("child_process").exec
const log = console.debug

const ocr = async (msg) => {
  if(msg.hasQuotedMsg){
    const quoted = await msg.getQuotedMessage()
    if(quoted.hasMedia){
      let filename = new Date().getTime();
      let fullFilename

      quoted.downloadMedia().then(async media => {
        if (media) {
          const mediaPath = './public/';

          if (!fs.existsSync(mediaPath)) {
            fs.mkdirSync(mediaPath);
          }

          const extension = mime.extension(media.mimetype);
          filename = filename + '.' + extension
          fullFilename = mediaPath + filename;

          try {
            fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' }); 
          } catch (err) {
            console.log('Failed to save the file:', err);
          }

          await recognize(fullFilename, {lang: 'eng+ind', oem: 1, psm: 3})
            .then(teks => {
              msg.reply(teks.trim())
              fs.unlinkSync(fullFilename)
          })
          .catch(err => {
            msg.reply("OCR gagal")
            console.error("OCR error: ", err)
            fs.unlinkSync(fullFilename)
          })
        }
      })
    }
  }
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
