'use strict';

const fs = require('fs');
const winston = require('winston');

const Printer = require('./printer');

const printer = new Printer();

const Localprint = function () {
  winston.log('info', 'localprint initialized');
};

Localprint.prototype.start = function () {
  const items = [ 'schere', 'stein', 'papier' ];

  fs.readFile('./application.png', (err, imgData) => {
    if (err) {
      return winston.log('error', 'error while reading local image file');
    }

    const base64img = new Buffer(imgData).toString('base64');

    const data = {
      from: items[Math.floor(Math.random() * items.length)],
      content: '',
      image: base64img,
      meta: ''
    };

    printer.print(data, () => {
      winston.log('printed', data);
    });
  });
};

module.exports = Localprint;
