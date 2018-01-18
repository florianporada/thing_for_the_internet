"use strict";

const config = {};

config.socketurl = process.env.SOCKET_URL || "localhost";
config.socketport = process.env.SOCKET_PORT || "3033";
config.webport = process.env.WEB_PORT || "4444";

module.exports = config;
