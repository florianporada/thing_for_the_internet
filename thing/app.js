'use strict';

const config = require('./config');
const socket = require('socket.io-client')(`http://${config.socketurl}:${config.socketport}`);

const Printer = require('./components/printer');
const printer = new Printer();

socket.on('connect', () => {
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
  printer.print(data);
});

socket.on('disconnect', () => {
  console.log('Connection closed');
});
