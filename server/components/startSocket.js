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
  this.printers = [];

  this.printerlist = function () {
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

        this.socket.emit('printerlist', this.printerlist());
      }

      if (opt.type === 'client') {
        this.socket.emit('printerlist', this.printerlist());
        this.logger.info(`client ${opt.name} registered`);
      }
    });

    client.on('getPrinters', () => {
      this.socket.emit('printerlist', this.printerlist());
    });

    client.on('printMessage', data => {
      if (this.printers.length === 0) {
        return this.logger.error('No printer connected');
      }

      for (let i = 0, len = this.printers.length; i < len; i++) {
        if (this.printers[i].id === data.id) {
          this.logger.info(`emitted print`);
          this.socket.to(this.printers[i].id).emit('printme', data.message);
        }
      }
    });

    client.on('message', event => {
      this.logger.info('Received message from client!', { event });
    });

    client.on('disconnect', () => {
      if (client.type === 'printer') {
        this.printers.splice(this.printers.indexOf(client), 1);
      }

      this.logger.info('Client has disconnected');
    });
  });

  this.logger.info(`Socket-Server running at: ${config.hostip} Port: ${this.socketPort}`);
};

module.exports = StartSocket;
