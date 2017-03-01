'use strict';

const socket = require('socket.io-client')('http://127.0.0.1:3030');

socket.on('connect', () => {
  console.log('Connected');
  socket.send('Hello, server! Love, Client.');
});

socket.on('event', data => {
  console.log('Received: ', data);
});

socket.on('disconnect', () => {
  console.log('Connection closed');
});
