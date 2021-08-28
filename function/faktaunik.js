const fetch = require("node-fetch")

const faktaunik = async (client, msg, args) => {
  fetch('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-fakta-unik.txt')
    .then(res => res.text())
    .then(body => {
      let tod = body.split("\n");
      let pjr = tod[Math.floor(Math.random() * tod.length)];
      msg.reply(pjr);
  })
}

module.exports = {
  faktaunik
}