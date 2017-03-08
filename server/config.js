'use strict';

let config = {};

config.socketurl = process.env.SOCKET_URL || '192.168.2.101';
config.socketport = process.env.SOCKET_PORT || '3030';
config.webport = process.env.WEB_PORT || '3333';

module.exports = config;
