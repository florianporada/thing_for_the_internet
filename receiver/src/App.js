import React, { Component } from 'react';
import io from 'socket.io-client';

import { SOCKET_URL, SOCKET_PORT, RECEIVER_ID, RECEIVER_NAME } from './config';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: 'idle',
    };

    this.initSocket();
  }

  initSocket() {
    this.socket = io.connect(`${SOCKET_URL}:${SOCKET_PORT}`, { transports: ['websocket'] });
    this.socket.on('connect', () => {
      console.log('info', 'Connected');
      this.socket.emit('register', {
        name: RECEIVER_NAME,
        type: 'receiver',
        uid: RECEIVER_ID
      });
    });

    this.socket.on('signalToReceiver', data => {
      // winston.log('info', 'recieved: ', { data });
      this.socket.emit('received', { clientId: data.clientId, receiverId: data.receiverId });

      switch (data.payload.event) {
        case 'blinkStart':
          console.log('info', 'startBlinking');

          break;
        case 'blinkStop':
          console.log('info', 'stopBlinking');

          break;
        case 'movement':
          console.log('info', 'movement', data);

          break;
        default:
      }
    });

    this.socket.on('disconnect', () => {
      console.log('info', 'Connection closed');
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
