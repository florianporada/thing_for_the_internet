'use strict';

const config = {};

config.id = 1;
config.passcode = 'verysafe';
config.name = 'the one receiver';
config.protocol = 'http';
config.socketurl = process.env.SOCKET_URL || 'localhost';
config.socketport = process.env.SOCKET_PORT || '3030';
config.baudrate = 9600;

module.exports = config;
