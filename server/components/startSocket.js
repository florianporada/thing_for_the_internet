'use strict';

const http = require('http');
const io = require('socket.io');
const flaschenpost = require('flaschenpost');

const config = {
  socketport: 3030,
  hostip: '127.0.0.1'
};

const StartSocket = function () {
  if (!(this instanceof StartSocket)) {
    return new StartSocket(config);
  }

  this.config = config;
  this.logger = flaschenpost.getLogger();
  this.socketPort = config.socketport;
  this.server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>hello dear friend!</h1>');
  });

  this.server.listen(this.socketPort);
  this.socket = io.listen(this.server);

  this.socket.on('connection', client => {
    this.logger.info('Connection to client established');
    this.client = client;

    client.on('message', event => {
      this.logger.info('Received message from client!', { event });
    });

    client.on('disconnect', () => {
      this.logger.info('Server has disconnected');
    });
  });

  this.logger.info(`Socket-Server running at: ${config.hostip} Port: ${this.socketPort}`);
};

StartSocket.prototype.emitPrint = function (id, data) {
  if (this.client === undefined) {
    return this.logger.error('No socket-client connected');
  }

  this.logger.info(`emitted print`);
  this.socket.to(id).emit('printme', data);
};

module.exports = StartSocket;
