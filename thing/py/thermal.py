#!/usr/bin/env python
# coding: utf-8

import sys, json, printer, textwrap

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #create printer object
    p = printer.ThermalPrinter(serialport='/dev/ttyAMA0')

    #get our data as an array from read_in()
    lines = read_in()

    p.justify('L')
    p.print_text(textwrap.fill(lines['content']) + '\n')
    #print lines['content']

    p.justify('R')
    p.print_text('--------' + '\n')
    p.font_b()
    p.print_text(lines['from'] + '\n')
    p.font_b(False)
    #print lines['from']

    p.justify('R')
    p.font_b()
    p.print_text(lines['meta'] + '\n')
    p.font_b(False)
    #print lines['meta']

    p.justify('L')
    p.print_text('________________________________')
    p.linefeed()
    p.linefeed()
    p.linefeed()



    # Print lines
    #for item in lines:
    #    print item
    #    print item['content']
    #    print item['meta']
    #    p.print_text(item)
    #    p.linefeed()
    #    p.linefeed()
    #    p.linefeed()

# Start process
if __name__ == '__main__':
    main()
