'use strict';

const socket = require('socket.io-client')('http://127.0.0.1:3030');

const Printer = require('./components/printer');
const printer = new Printer();

socket.on('connect', () => {
  console.log('Connected');
  socket.send('Hello, server! Love, Client.');
  socket.emit('register', {
    name: 'Printy McPrintface',
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
