'use strict';

const winston = require('winston');
// const gpio = require('rpi-gpio');
const Socket = require('socket.io-client');

const Printer = require('./components/printer');
const Webserver = require('./components/webserver');
const Db = require('./components/db');

const printer = new Printer();
const webserver = new Webserver();
const database = new Db();

database.init().then(() => {
  webserver.start();

  const config = database.getConfig();
  const socket = new Socket(`${config.protocol}://${config.socketurl}:${config.socketport}`);

  socket.on('connect', () => {
    winston.log('info', 'Connected');
    socket.emit('register', {
      name: config.name,
      type: 'receiver',
      uid: config.uid
    });
  });

  socket.on('event', data => {
    winston.log('info', 'event: ', data);
  });

  socket.on('signalToReceiver', data => {
    winston.log('info', 'recieved: ', { data });
    socket.emit('received', { clientId: data.clientId, receiverId: data.receiverId });

    switch (data.payload.event) {
      case 'blinkStart':
        winston.log('info', 'startBlinking');

        break;
      case 'blinkStop':
        winston.log('info', 'stopBlinking');

        break;
      default:
    }
  });

  socket.on('disconnect', () => {
    winston.log('info', 'Connection closed');
  });
});
