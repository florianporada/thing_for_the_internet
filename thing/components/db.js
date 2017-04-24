'use strict';

const path = require('path');

const winston = require('winston');
const low = require('lowdb');
const bcrypt = require('bcrypt');

const initConfig = require('../config.js');
const dbPath = path.join(__dirname, '..', 'db.json');
const db = low(dbPath);

const Db = function () {
};

Db.prototype.init = function () {
  return new Promise((resolve, reject) => {
    winston.log('info', 'db initialized');

    const configExists = db.has('config').value();
    const configSize = db.get('config').
      size().
      value();

    if (!configExists && configSize === 0) {
      winston.log('info', 'no config found, write default config to db');

      bcrypt.hash(initConfig.passcode, 10, (err, hash) => {
        if (err) {
          winston.log('error', 'an error has appeard during the passcode hashing', err);
          reject();
        } else {
          db.set('config', [{
            id: 1,
            uid: hash,
            name: initConfig.name,
            passcode: hash,
            protocol: initConfig.protocol,
            socketurl: initConfig.socketurl,
            socketport: initConfig.socketport
          }]).
            write();
          resolve();
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
        winston.log('error', 'an error has appeard during the passcode hashing', err);
      } else {
        db.get('config').
          find({ id: 1 }).
          assign({
            name: data.name,
            passcode: hash,
            protocol: data.protocol,
            socketurl: data.socketurl,
            socketport: data.socketport
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
        socketport: data.socketport
      }).
      write();
  }
};

Db.prototype.checkPasscode = function (passcode) {
  const config = db.get('config').
    find({ id: 1 }).
    value();

  bcrypt.compare(passcode, config.passcode, (err, res) => {
    if (err) {
      winston.log('error', 'an error has appeard during the hash comparison', err);
    } else {
      return res;
    }
  });
};

module.exports = Db;
