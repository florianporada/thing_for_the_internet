'use strict';

const https = require('https');
const fs = require('fs');
const io = require('socket.io');
const flaschenpost = require('flaschenpost');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/noiseyairplanes.me/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/noiseyairplanes.me/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/noiseyairplanes.me/chain.pem')
};

const StartSocket = function (config) {
  if (!(this instanceof StartSocket)) {
    return new StartSocket(config);
  }

  this.config = config;
  this.logger = flaschenpost.getLogger();
  this.server = https.createServer(options, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>hello dear friend!</h1>');
  });

  this.server.listen(this.config.socketport);
  this.socket = io.listen(this.server);
  this.printers = [];

  this.printerList = function () {
    const tmpPrinters = [];

    for (let i = 0, len = this.printers.length; i < len; i++) {
      tmpPrinters.push({ id: this.printers[i].id, name: this.printers[i].name });
    }

    return tmpPrinters;
  };

  this.socket.on('connection', client => {
    this.logger.info('Connection to client established');

    client.on('register', opt => {
      if (opt.type === 'printer') {
        client.name = opt.name;
        client.type = opt.type;
        this.printers.push(client);
        this.logger.info(`printer ${opt.name} registered`);
      }

      if (opt.type === 'client') {
        this.socket.emit('clientId', client.id);
        this.logger.info(`client ${opt.name} registered`);
      }

      this.socket.emit('printerList', this.printerList());
    });

    client.on('getPrinters', () => {
      this.socket.emit('printerList', this.printerList());
    });

    client.on('printed', data => {
      this.socket.to(data.clientId).emit('printedMessage', data);
    });

    client.on('printMessage', data => {
      if (this.printers.length === 0) {
        return this.logger.error('No printer connected');
      }

      for (let i = 0, len = this.printers.length; i < len; i++) {
        if (this.printers[i].id === data.printerId) {
          this.logger.info(`emitted print`);
          this.socket.to(this.printers[i].id).emit('printme', data);
        }
      }
    });

    client.on('message', event => {
      this.logger.info('Received message from client!', { event });
    });

    client.on('disconnect', () => {
      if (client.type === 'printer') {
        this.printers.splice(this.printers.indexOf(client), 1);
        this.socket.emit('printerList', this.printerList());
      }

      this.logger.info('Client has disconnected');
    });
  });

  this.logger.info(`Socket-Server running at: ${this.config.socketurl} Port: ${this.config.socketport}`);
};

module.exports = StartSocket;
