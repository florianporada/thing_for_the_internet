'use strict';

let config = {};

config.name = 'Printy McPrintface';
config.socketurl = process.env.SOCKET_URL || 'noiseyairplanes.me';
config.socketport = process.env.SOCKET_PORT || '3030';

module.exports = config;
