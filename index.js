'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const waRoutes = require('./routes/wa-routes');
const userRoutes = require('./routes/user-routes');
const quoteRoutes = require('./routes/quote-routes');
const path = require("path")

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"))
})

app.get('/wa', function (req, res) {
  res.sendFile(path.join(__dirname, "views/wa.html"))
})

app.get('/user', function (req, res) {
  res.sendFile(path.join(__dirname, "views/user.html"))
})

app.get('/quote', function (req, res) {
  res.sendFile(path.join(__dirname, "views/quote.html"))
})

app.use('/wa', waRoutes.routes);
app.use('/api/user', userRoutes.routes);
app.use('/api/quote', quoteRoutes.routes);

app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));
