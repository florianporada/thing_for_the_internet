'use strict';

const config = require('./config');
const gpio = require('rpi-gpio');
const socket = require('socket.io-client')(`https://${config.socketurl}:${config.socketport}`);
const led = 12;

const Printer = require('./components/printer');
const printer = new Printer();

const ledSwitch = function (state) {
  switch (state) {
    case 'on':
      gpio.write(led, true, err => {
        if (err) {
          console.log(err);
        }
      });
      break;
    case 'blink': {
      let count = 0;
      const intervalObject = setInterval(() => {
        count += 1;
        gpio.write(led, count % 2 === 0, err => {
          if (err) {
            console.log(err);
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
          console.log(err);
        }
      });
      break;
    default:
  }
};

socket.on('connect', () => {
  gpio.setup(led, gpio.DIR_OUT, () => {
    ledSwitch('on');
  });
  console.log('Connected');
  socket.emit('register', {
    name: `${config.name}`,
    type: 'printer'
  });
});

socket.on('event', data => {
  console.log('Received: ', data);
});

socket.on('printme', data => {
  ledSwitch('blink');
  if (socket.connected) {
    ledSwitch('on');
  } else {
    ledSwitch('off');
  }

  printer.print(data.message, () => {
    //console.log('printed', data.content, data.from, data.meta);
    socket.emit('printed', { clientId: data.clientId, printerId: data.printerId });
  });
});

socket.on('disconnect', () => {
  ledSwitch('off');
  console.log('Connection closed');
});
