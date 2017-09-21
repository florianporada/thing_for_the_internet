Install guide.

- copy the 'thing' folder to your pi
- `cd thing/`
- run the `install.sh` file to prepare your thing
- run `npm install && bower install` in the 'thing' folder
- add the following code to `/etc/rc.local`
  ```
  cd <PATH_TO_THE_APP>
  sudo pm2 start app.js &
  ```
- restart your pi
- open a hotspot with `SSID: printrconfig` `PSK: 1234567890`
- go to `http://<IP_ADDRESS_OF_THE_PI>:8888/`
- configure the printr.
- restart your pi
- finish
