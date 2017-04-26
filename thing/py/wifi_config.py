#!/usr/bin/env python
# coding: utf-8

import sys, json

def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    lines = read_in()

    hs = open('/etc/wpa_supplicant/wpa_supplicant.conf','a')
    hs.write('\n')
    hs.write('network={\n')
    hs.write('\tssid="' + lines['ssid'] + '"\n')
    hs.write('\tpsk="' + lines['psk'] + '"\n')
    hs.write('\tkey_mgmt=WPA-PSK\n')
    hs.write('}')
    hs.close()


# Start process
if __name__ == '__main__':
    main()
