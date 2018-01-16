/* @flow */
import React, { Component } from 'react';
import { Image, Modal } from 'react-native';
import io from 'socket.io-client';
import styled from 'styled-components/native';

import { SOCKET_URL, SOCKET_PORT } from './config';
import Button from './components/Button';
import Trackpad from './components/Trackpad';
import Colorpicker from './components/Colorpicker';

const Branding = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  background-color: #525252;
  padding-top: 2.5;
  padding-bottom: 2.5;
`;

const Container = styled.View`
  flex: 1;
  padding-top: 25;
  padding-right: 5;
  padding-bottom: 5;
  padding-left: 5;
  background-color: #1c1c1c;
`;

const LoadingView = styled.View`
  flex: 1;
  background-color: #1c1c1c;
  align-items: center;
  justify-content: center;
`;

const ButtonGroup = styled.View`
  flex: 1;
  justify-content: center;
  align-items: stretch;
`;

const Text = styled.Text`
  text-align: center;
  color: #525252;
`;

type Props = {};

type State = {
  connected: boolean,
  receiver: any,
  x: number,
  y: number,
  status: string,
  modalVisible: boolean
};

export default class App extends Component<Props, State> {
  socket: Object;

  constructor(props: Props) {
    super(props);

    this.state = {
      connected: false,
      receiver: null,
      x: 0,
      y: 0,
      status: 'loading...',
      modalVisible: false
    };

    this.socket = io.connect(`${SOCKET_URL}:${SOCKET_PORT}`, { transports: ['websocket'] });

    this.socket.on('connect', () => {
      this.setState({
        connected: true
      });
      this.socket.emit('getReceivers');
    });

    this.socket.on('receiverList', data => {
      if (data.length > 0) {
        this.setState({
          receiver: data[0]
        });
      } else {
        this.setState({
          receiver: null,
          status: 'no receiver available...'
        });
      }
    });
  }

  onBlinkButtonPressIn() {
    this.socket.emit('signalFromClient', {
      receiverId: this.state.receiver.id,
      clientId: this.socket.id,
      payload: {
        event: 'blinkStart'
      }
    });
  }

  onBlinkButtonPressOut() {
    this.socket.emit('signalFromClient', {
      receiverId: this.state.receiver.id,
      clientId: this.socket.id,
      payload: {
        event: 'blinkStop'
      }
    });
  }

  onColorButtonPressIn() {
    this.setState({
      modalVisible: true
    });
  }

  onModalClose({ color1, color2 }: { color1: string, color2: string }) {
    this.setState({ modalVisible: false });
    this.socket.emit('signalFromClient', {
      receiverId: this.state.receiver.id,
      clientId: this.socket.id,
      payload: {
        event: 'color',
        data: {
          color1,
          color2
        }
      }
    });
  }

  onTouchMove(x: number, y: number) {
    this.setState({ x, y });
    this.socket.emit('signalFromClient', {
      receiverId: this.state.receiver.id,
      clientId: this.socket.id,
      payload: {
        event: 'movement',
        data: {
          x,
          y
        }
      }
    });
  }

  renderLoading() {
    return (
      <LoadingView>
        <Text>{this.state.status}</Text>
      </LoadingView>
    );
  }

  render() {
    if (!this.state.connected || !this.state.receiver) return this.renderLoading();
    return (
      <Container>
        <Modal visible={this.state.modalVisible} animationType={'slide'} transparent>
          <Colorpicker onClose={this.onModalClose.bind(this)} />
        </Modal>
        <Text>Connected to: {this.state.receiver.name}</Text>
        <Text>
          x: {this.state.x} y: {this.state.y}
        </Text>
        <ButtonGroup>
          <Button
            onPressIn={this.onBlinkButtonPressIn.bind(this)}
            onPressOut={this.onBlinkButtonPressOut.bind(this)}
          >
            <Text>Blink</Text>
          </Button>
          <Button onPressIn={this.onColorButtonPressIn.bind(this)}>
            <Text>Color</Text>
          </Button>
          {/* <Button onPressIn={this.onBlinkButtonPressIn.bind(this)}>
            <Text>something else..</Text>
          </Button> */}
          <Trackpad
            onTouchMove={({ x, y }) => {
              this.onTouchMove(x, y);
            }}
          />
        </ButtonGroup>
        <Branding>
          <Image
            style={{
              alignSelf: 'center',
              height: 30,
              width: 100
            }}
            source={{
              uri:
                'https://cdn.greenhouse.io/external_greenhouse_job_boards/logos/000/005/398/original/Large_Logo-moovel_h_shiny_petrol_rgb.png?1460479590'
            }}
            resizeMode="center"
          />
          <Text style={{ color: '#1c1c1c', fontSize: 25, fontWeight: '100' }}>&#x2223;</Text>
          <Image
            style={{
              alignSelf: 'center',
              height: 30,
              width: 100
            }}
            resizeMode="center"
            source={{
              uri: 'https://www.emobil-in-bw.de/uploads/tx_srfeuserregister/FraunhoferIAO_Logo.png'
            }}
          />
        </Branding>
      </Container>
    );
  }
}
