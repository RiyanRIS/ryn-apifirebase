// Special thanks to Sumanjay for his carbon api

const axios = require('axios');

async function mainF(text) {

    // var respoimage = await axios.get(`https://carbon.now.sh/?code=${text.replace(/ /gi,"+")}&theme=darcula&backgroundColor=rgba(36, 75, 115)`, { responseType: 'arraybuffer' }).catch(function(error) {
    //     return "error"
    // })

    var respoimage =await axios({
      method: 'post',
      url: 'https://carbonara.vercel.app/api/cook',
      data: {
        "code": text,
      },
      responseType: "arraybuffer",
  })
  return respoimage
  // .then(function (response) {
  //   return ({
  //     mimetype: "image/png",
  //     data: Buffer.from(response.data).toString('base64'),
  //     filename: "carbon.png"
  //   })
  // })
  // .catch(function (error) {
  //     // console.log(error);
  //     return "error"
  // });

}

module.exports = {
    mainF
}