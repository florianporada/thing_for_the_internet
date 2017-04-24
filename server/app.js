'use strict';

const express = require('express');
const flaschenpost = require('flaschenpost');
const config = require('./config');

const SocketService = require('./components/socketService');

const app = express();
const router = express.Router();
const logger = flaschenpost.getLogger();
const socketService = new SocketService(config);

socketService.start();

app.use(router);

app.listen(config.webport, () => {
  logger.info(`Express server listening on port ${config.webport}`);
});
