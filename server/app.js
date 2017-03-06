'use strict';

const express = require('express');
const flaschenpost = require('flaschenpost');

const StartSocket = require('./components/startSocket');

const app = express();
const router = express.Router();
const logger = flaschenpost.getLogger();
const startSocket = new StartSocket();

app.use(router);

app.listen(3333, () => {
  logger.info('Express server listening on port 3000');
});
