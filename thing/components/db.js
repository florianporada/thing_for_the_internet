const path = require('path');
const fs = require('fs');

const low = require('lowdb');
const bcrypt = require('bcrypt');

const dbPath = '/db.json';
const db = low('db.json');

const configg = require('../config');


const Db = function (config) {
  console.info('db initialized');

  const configExists = db.has('config').value();
  const configSize = db.get('config').
    size().
    value();

  if (!configExists && configSize === 0) {
    console.info('no config found, write default config to db');

    bcrypt.hash(config.passcode, 10, (err, hash) => {
      if (err) {
        console.log('an error has appeard', err)
      }

      console.log(hash);

      db.set('config', [{
        id: 1,
        name: config.name,
        passcode: hash,
        protocol: config.protocol,
        socketurl: config.socketurl,
        socketport: config.socketport
      }]).
        write();
    });
  }
};

Db.prototype.updateConfig = function (data) {
  db.get('config').
    find({ id: 1 }).
    assign({
      name: data.name,
      protocol: data.protocol,
      socketurl: data.socketurl,
      socketport: data.socketport
    }).
    write();
};

Db.prototype.checkPasscode = function (passcode) {
  const config = db.get('config').
    find({ id: 1 }).
    value();

  bcrypt.compare(passcode, config.passcode, (err, res) => {
    if (err) {
      console.log('an error has appeard', err)
    }

    return res;
  });
};

Db(configg);
