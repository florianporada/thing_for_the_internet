'use strict';

const config = {};

config.id = 1;
config.passcode = 'verysafe';
config.name = 'Printy McPrintface';
config.protocol = 'https';
config.socketurl = process.env.SOCKET_URL || 'noiseyairplanes.me';
config.socketport = process.env.SOCKET_PORT || '3030';

module.exports = config;
