'use strict';

const winston = require('winston');
const gpio = require('rpi-gpio');
const Socket = require('socket.io-client');
const led = 12;

const Printer = require('./components/printer');
const Webserver = require('./components/webserver');
const Db = require('./components/db');

const printer = new Printer();
const webserver = new Webserver();
const database = new Db();

const ledSwitch = function (state) {
  switch (state) {
    case 'on':
      gpio.write(led, true, err => {
        if (err) {
          winston.log('error', err);
        }
      });
      break;
    case 'blink': {
      let count = 0;
      const intervalObject = setInterval(() => {
        count += 1;
        gpio.write(led, count % 2 === 0, err => {
          if (err) {
            winston.log('error', err);
          }
        });

        if (count === 10) {
          clearInterval(intervalObject);
        }
      }, 100);

      break;
    }
    case 'off':
      gpio.write(led, false, err => {
        if (err) {
          winston.log('error', err);
        }
      });
      break;
    default:
  }
};

database.init().then(() => {
  webserver.start();

  const config = database.getConfig();
  const socket = new Socket(`${config.protocol}://${config.socketurl}:${config.socketport}`);

  socket.on('connect', () => {
    gpio.setup(led, gpio.DIR_OUT, () => {
      ledSwitch('on');
    });
    winston.log('info', 'Connected');
    socket.emit('register', {
      name: config.name,
      type: 'printer',
      uid: config.uid
    });
  });

  socket.on('event', data => {
    winston.log('info', 'Received: ', data);
  });

  socket.on('printme', data => {
    ledSwitch('blink');
    if (socket.connected) {
      ledSwitch('on');
    } else {
      ledSwitch('off');
    }

    printer.print(data.message, () => {
      winston.log('info', data.content, data.from, data.meta);
      socket.emit('printed', { clientId: data.clientId, printerId: data.printerId });
    });
  });

  socket.on('disconnect', () => {
    ledSwitch('off');
    winston.log('info', 'Connection closed');
  });
});
