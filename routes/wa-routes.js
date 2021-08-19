const express = require('express');
const {send, 
       cek, 
      } = require('../controllers/waController');

const router = express.Router();

router.post('/send', send);
router.get('/cek', cek);

module.exports = {
    routes: router
}