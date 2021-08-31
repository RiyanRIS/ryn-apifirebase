const puppeteer = require("puppeteer")
const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const wa = require('../lib/wa');

const twd = async (sender, args, msg, b) => {
  try{
    (async () => {
      const browser = await puppeteer.launch({
        headless: false,
      })
      const page = await browser.newPage();
      await page
        .goto("https://id.savefrom.net/download-from-twitter", {
          waitUntil: "networkidle2",
        })
        .then(async () => {
          await page.type("#sf_url", args[0]);
          await page.click("#sf_submit");
          await new Promise(resolve => setTimeout(resolve, 5000));
          try {
            await page.waitForSelector("#sf_result");
            const element = await page.$("a.link-download");
            const link = await (await element.getProperty("href")).jsonValue();
            const text = await (await element.getProperty("download")).jsonValue();

            const filename = new Date().getTime()
            const path = `./public/${filename}.mp4`;
            const file = fs.createWriteStream(path);
            const request = http.get(link, function(response) {
              response.pipe(file);
            })

            file.on("finish", async () => {
              const videonya = fs.readFileSync(path)
              await wa.sendVideo(sender, videonya, `*🙇‍♂️ Berhasil*\n\n${text}`)
            })

          } catch (error) {
            console.log(error);
            wa.reply(sender, `error`)
          }
        })
        .catch((err) => {
          console.log(err);
          wa.reply(sender, `error`)
        });
        browser.close();
    })();
  } catch(err) {
    console.log(err);
    WA.reply(sender, `error`)
  }
}

module.exports = {
  twd
}