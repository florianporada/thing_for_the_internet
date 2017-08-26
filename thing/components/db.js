'use strict';

const path = require('path');

const winston = require('winston');
const low = require('lowdb');
const bcrypt = require('bcrypt');
const SerialPort = require('serialport');

const initConfig = require(path.join(__dirname, '..', 'config.js'));
const dbPath = path.join(__dirname, '..', 'db.json');
const db = low(dbPath);

const Db = function () {
  winston.log('info', 'db initialized');
};

Db.prototype.init = function () {
  return new Promise((resolve, reject) => {
    winston.log('info', 'db initialized');

    const configExists = db.has('config').value();
    const configSize = db.get('config').
      size().
      value();

    if (!configExists || configSize === 0) {
      winston.log('info', 'no config found, write default config to db');

      bcrypt.hash(initConfig.passcode, 10, (err, hash) => {
        if (err) {
          winston.log('error', 'an error has occurred during the passcode hashing', err);
          reject();
        } else {
          const serialportNames = [];

          SerialPort.list((err1, ports) => {
            if (err) {
              winston.log('error', 'an error has occurred while getting the serialports', err1);
              reject();
            } else {
              ports.forEach(port => {
                serialportNames.push(port.comName);
              });

              db.set('config', [{
                id: 1,
                uid: hash,
                name: initConfig.name,
                passcode: hash,
                protocol: initConfig.protocol,
                socketurl: initConfig.socketurl,
                socketport: initConfig.socketport,
                serialport: ports[0].comName,
                baudrate: initConfig.baudrate,
                serialports: serialportNames
              }]).
                write();
              resolve();
            }
          });
        }
      });
    } else {
      resolve();
    }
  });
};

Db.prototype.getConfig = function () {
  return db.get('config').
    find({ id: 1 }).
    value();
};

Db.prototype.updateConfig = function (data) {
  if (data.passcode !== this.getConfig().passcode) {
    bcrypt.hash(data.passcode, 10, (err, hash) => {
      if (err) {
        winston.log('error', 'an error has occurred during the passcode hashing', err);
      } else {
        db.get('config').
          find({ id: 1 }).
          assign({
            name: data.name,
            passcode: hash,
            protocol: data.protocol,
            socketurl: data.socketurl,
            socketport: data.socketport,
            serialport: data.serialport,
            baudrate: data.baudrate
          }).
          write();
      }
    });
  } else {
    db.get('config').
      find({ id: 1 }).
      assign({
        name: data.name,
        passcode: data.passcode,
        protocol: data.protocol,
        socketurl: data.socketurl,
        socketport: data.socketport,
        serialport: data.serialport,
        baudrate: data.baudrate
      }).
      write();
  }
};

Db.prototype.resetConfig = function () {
  db.get('config').
    remove({ id: 1 }).
    write();
};

Db.prototype.checkPasscode = function (passcode) {
  const config = db.get('config').
    find({ id: 1 }).
    value();

  bcrypt.compare(passcode, config.passcode, (err, res) => {
    if (err) {
      winston.log('error', 'an error has occurred during the hash comparison', err);
    } else {
      return res;
    }
  });
};

module.exports = Db;
