'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const restify = require('express-restify-mongoose');
const flaschenpost = require('flaschenpost');

const StartSocket = require('./components/startSocket');

const app = express();
const router = express.Router();
const logger = flaschenpost.getLogger();
const startSocket = new StartSocket();

app.use(bodyParser.json());
app.use(methodOverride());

mongoose.connect('mongodb://localhost/iot');

restify.serve(router, mongoose.model('Thing', new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String }
})));

app.use(router);

app.listen(3333, () => {
  logger.info('Express server listening on port 3000');
});
