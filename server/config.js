'use strict';

const config = {};

config.socketurl = process.env.SOCKET_URL || 'noiseyairplanes';
config.socketport = process.env.SOCKET_PORT || '3030';
config.webport = process.env.WEB_PORT || '3333';

module.exports = config;
