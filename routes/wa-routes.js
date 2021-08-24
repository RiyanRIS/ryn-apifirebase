const express = require('express');
const {send, 
      } = require('../controllers/waController');

const router = express.Router();

router.post('/send', send);

module.exports = {
    routes: router
}