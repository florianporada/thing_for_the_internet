#!/bin/bash
# installing this thing script

# installing latest node version
sudo apt-get update && sudo apt-get upgrade

sudo apt-get install git-core python-serial python-dev python-setuptools python-imaging-tk

sudo wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v.last.sh | bash

# TODO: test if necessary
# sudo systemctl disable serial-getty@ttyAMA0.service

sudo usermod -a -G dialout pi

# TODO:

sudo npm install pm2 -g && sudo npm install bower -g

sudo ln -s /opt/nodejs/bin/pm2 /usr/bin/pm2
sudo ln -s /opt/nodejs/bin/bower /usr/bin/bower
