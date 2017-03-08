'use strict';

const express = require('express');
const flaschenpost = require('flaschenpost');
const config = require('./config');

const StartSocket = require('./components/startSocket');

const app = express();
const router = express.Router();
const logger = flaschenpost.getLogger();
const startSocket = new StartSocket(config);

app.use(router);

app.listen(config.webport, () => {
  logger.info(`Express server listening on port ${config.webport}`);
});
