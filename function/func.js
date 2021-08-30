const fetch = require('node-fetch')

const shortlink = (url, options) => new Promise(async (resolve, reject) => {
  fetch(`https://tinyurl.com/api-create.php?url=${url}`, options)
      .then(response => response.text())
      .then(text => {
          resolve(text)
      })
      .catch((err) => {
          reject(err)
      })
})

// https://stackoverflow.com/a/11486026
const formatTime = (duration) => {   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const getGroupAdmins = (participants) => {
	admins = []
	for (let i of participants) {
		i.isAdmin ? admins.push(i.id.user) : ''
	}
	return admins
}

const getRandomExt = (ext) => {
    const filename = new Date().getTime()
    return `${filename}${ext}`
}

module.exports = { shortlink, formatBytes, formatTime, getGroupAdmins, getRandomExt }