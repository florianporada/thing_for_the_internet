'use strict';

const path = require('path');
const winston = require('winston');
const express = require('express');
const bodyParser = require('body-parser');
const PythonShell = require('python-shell');
const Db = require('./db');
const app = express();
const port = 8888;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const Webserver = function () {
  this.database = new Db();
};

Webserver.prototype.start = function () {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', `public/index.html`));
  });

  app.get('/api/getConfig', (req, res) => {
    res.send(this.database.getConfig());
  });

  app.post('/api/updateConfig', (req, res) => {
    this.database.updateConfig(req.body);
    res.send('OK');
  });

  app.post('/api/updateWifiConfig', (req, res) => {
    const shell = new PythonShell(path.normalize(path.join('.', 'py', 'wifi_config.py')));

    shell.send(JSON.stringify(req.body));
    shell.end(err => {
      if (err) {
        winston.log('error', `error while writing wifi config`, err);
      } else {
        res.send('OK');
      }
    });
  });

  /* serves all the static files */
  app.get(/^(.+)$/, (req, res) => {
    winston.log('info', `static file request :`, req.params);
    res.sendFile(path.join(__dirname, '..', `public/${req.params[0]}`));
  });

  app.listen(port, () => {
    winston.log('info', `Listening on ${port}`);
  });
};

module.exports = Webserver;
