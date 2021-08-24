'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const waRoutes = require('./routes/wa-routes');
// const quoteRoutes = require('./routes/quote-routes');
const path = require("path")

const app = express();
const serveIndex = require('serve-index');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"))
})

app.get('/wa', function (req, res) {
  res.sendFile(path.join(__dirname, "views/wa.html"))
})

app.use('/public', express.static('public'), serveIndex('public', { 'icons': true }))

app.use('/wa', waRoutes.routes);

app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));
