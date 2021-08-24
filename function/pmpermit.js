'use strict';

const firebase = require('../db');
const firestore = firebase.firestore();

const fs_pmpermit = firestore.collection('apiwa/v1/pmpermit');

const fs = require('fs');

async function insert(id) {
    try {
      let data = {
        number: id, times: 1, permit: false
      }
      await fs_pmpermit.doc(id).set(data);
      return "inserted"
    } catch (err) {
        return "insert_error"
    }
}

async function updateviolant(id, timesvio) { // promise update times data
    try {
        let data = await fs_pmpermit.doc(id).get()

        let newlimit = {
          number: id, times: timesvio, permit: data.data().permit
        }

        await fs_pmpermit.doc(id).update(newlimit)

        return "updated"

    } catch (err) {
        return "update_error"
    }
}

async function readdb(id) { //Promise read data

    try {
      let data = await fs_pmpermit.doc(id).get()
      if (!data.exists) {
        return ({
          status: "not_found"
        })
      } else {
        data = data.data()
          var out = ({
              status: "found",
              number: data.number,
              times: data.times,
              permit: data.permit
          })
          return out
      }
    } catch (err) {
        return "read_error"
    }
}

async function permitacton(id) {
  try {
    let newlimit = {
      number: id, times: 1, permit: true
    }

    await fs_pmpermit.doc(id).update(newlimit)

    return "success"

  } catch (err) {
      return "error"
  }
}

async function nopermitacton(id) {
  try {
    let newlimit = {
      number: id, times: 1, permit: false
    }

    await fs_pmpermit.doc(id).update(newlimit)

    return "success"

  } catch (err) {
      return "error"
  }
}

async function handler(id) {

    async function checkfile(id) {
        try {
            return JSON.parse(await fs.readFileSync(__dirname + `/tempdata/${id}.json`, { encoding: 'utf8' }))
        } catch (error) {
            return await readdb(id)
        }
    }

    var read = await checkfile(id)

    if (read.status == "not_found") { // Insert 
        var insertdb = await insert(id)
        if (insertdb == "insert_error") {
            return "error"
        } else {
            var out = ({
                mute: false,
                msg: `*✋ Wait*\n\nPlease wait until I will get back to Online, Kindly don't send another message.`
            })
            return out
        }
    } else if (read.status == "found" && read.permit == false) { // if got a object
        if (read.times == 4) {
            var out = ({
                mute: true,
                msg: `*✋ Muted*\n\nYou have been muted for 30 Minutes for spamming.`
            })
            return out
        } else { // Update times
            var update = await updateviolant(id, Number(read.times) + Number(1))
            if (update == "update_error") {
                return "error"
            } else {
                var out = ({
                    mute: false,
                    msg: `*✋ Wait*\n\nPlease wait until I will get back to Online, Kindly don't send another message. You have ${read.times} warning(s).`
                })
                return out
            }
        }
    } else if (read.status == "found" && read.permit == true) {
        return "permitted"
    }
}

module.exports = {
    handler,
    permitacton,
    nopermitacton
}