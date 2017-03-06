'use strict';

const flaschenpost = require('flaschenpost');

const Printer = function () {
  this.logger = flaschenpost.getLogger();

  this.logger.info('printer initialized');
};

Printer.prototype.print = function (data) {
  this.logger.info('printing', { data });
};

module.exports = Printer;
