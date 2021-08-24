'use strict';

const firebase = require('../db');
const { max_limit } = require('../src/limit');
const firestore = firebase.firestore();

const fs_limit = firestore.collection('apiwa/v1/limit');
const fs_banned = firestore.collection('apiwa/v1/banned');

module.exports = {

  buatLimit: async (id) => {
    try {
      let data = {
        id: id,
        limit: 0
      }
      await fs_limit.doc(id).set(data);
    } catch (error) {
      console.log('Limit add .. error msg: ' + error.message)
    }
  },

  isLimit: async (id) => {
    let data
    try {
      data = await fs_limit.doc(id).get()
      if(!data.exists) {
        try {
          let data = {
            id: id,
            limit: 0
          }
          await fs_limit.doc(id).set(data);
        } catch (error) {
          console.log('Limit add .. error msg: ' + error.message)
        }
      }
      
      data = await fs_limit.doc(id).get()

      if(data.data().limit > max_limit){
        return true
      }

      return false
    
    } catch (error) {
      console.log('Limit get .. error msg: ' + error.message)
    }
  },

  tambahLimit: async (id) => {
  let data
    try {
      data = await fs_limit.doc(id).get()

      let limit = data.data().limit + 1

      let newlimit = {
        id: id,
        limit: limit
      }; 

      await fs_limit.doc(id).update(newlimit);
    } catch (error) {
      console.log('Limit get .. error msg: ' + error.message)
    }
  },

  buatBanned: async (id) => {
    try {
      let data = {
        id: id,
      }
      await fs_banned.doc(id).set(data);
    } catch (error) {
      console.log('Banned buat .. error msg: ' + error.message)
    }
  },

  isBanned: async (id) => {
    let data
    try {
      data = await fs_banned.doc(id).get()

      if(data.exists){
        return true
      }

      return false
    } catch (error) {
      console.log('Limit get .. error msg: ' + error.message)
    }
  },


};