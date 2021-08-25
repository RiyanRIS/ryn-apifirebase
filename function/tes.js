const axios = require("axios");
const fs = require("fs");

x = async (text)=> {
  async function downloadFile(fileUrl, outputLocationPath) {
    const writer = fs.createWriteStream(outputLocationPath);
    return axios({
      method: "POST",
      url: fileUrl,
      data: {code : text},
      responseType: "stream",
    }).then((response) => {
      return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        let error = null;
        writer.on("error", (err) => {
          error = err;
          writer.close();
          reject(err);
        });
        writer.on("close", () => {
          if (!error) {
            resolve(true);
          }
        });
      });
    });
  }
  
  downloadFile(
    "https://carbonara.vercel.app/api/cook",
    "img.png"
  ).then((done) => {
  });
  }

  module.exports.x = x