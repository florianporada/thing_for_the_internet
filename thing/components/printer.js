'use strict';

const PythonShell = require('python-shell');
const datetime = require('node-datetime');

const Printer = function () {
  console.info('printer initialized');
};

Printer.prototype.print = function (data) {
  const shell = new PythonShell('./py/thermal.py');

  data.from = data.from.replace(/\u00dc/g, 'Ue');
  data.from = data.from.replace(/\u00fc/g, 'ue');
  data.from = data.from.replace(/\u00c4/g, 'Ae');
  data.from = data.from.replace(/\u00e4/g, 'ae');
  data.from = data.from.replace(/\u00d6/g, 'Oe');
  data.from = data.from.replace(/\u00f6/g, 'oe');
  data.from = data.from.replace(/\u00df/g, 'ss');

  data.content = data.content.replace(/\u00dc/g, 'Ue');
  data.content = data.content.replace(/\u00fc/g, 'ue');
  data.content = data.content.replace(/\u00c4/g, 'Ae');
  data.content = data.content.replace(/\u00e4/g, 'ae');
  data.content = data.content.replace(/\u00d6/g, 'Oe');
  data.content = data.content.replace(/\u00f6/g, 'oe');
  data.content = data.content.replace(/\u00df/g, 'ss');

  // Ü, ü     \u00dc, \u00fc
  // Ä, ä     \u00c4, \u00e4
  // Ö, ö     \u00d6, \u00f6
  // ß        \u00df

  const dt = datetime.create();

  data.meta = dt.format('d/m/Y H:M:S');
  shell.send(JSON.stringify(data));

  shell.on('message', message => {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
  });

  // end the input stream and allow the process to exit
  shell.end(err => {
    if (err) {
      throw err;
    }

    console.log('printed', { data });
  });
};

module.exports = Printer;
