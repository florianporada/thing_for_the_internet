Install guide.

- install node.js on your pi
- run `sudo apt-get update && sudo apt-get git-core python-serial python-dev python-setuptools python-imaging-tk`
- (run `sudo apt-get install libjpeg9-dev zlib1g-dev libfreetype6-dev liblcms1-dev`)
- run `sudo usermod -a -G dialout pi`
- in `/boot/cmdline.txt` replace content with `dwc_otg.lpm_enable=0 console=serial0,115200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 fsck.repair=yes rootwait`
- check which serialport to use (ttyAMA0 or ttyS0) and add it in `py/thermal.py`
- run `sudo npm install pm2 -g && sudo npm install bower -g`
- copy the 'thing' folder to your pi
- run `npm install && bower install` in the 'thing' folder
- add the following code to `/etc/rc.local`
  ```
  cd <PATH_TO_THE_APP>
  sudo pm2 start app.js &
  ```
- restart your pi
- go to http://<IP_ADDRESS_OF_THE_PI>:8888/
- configure the connection to the server
