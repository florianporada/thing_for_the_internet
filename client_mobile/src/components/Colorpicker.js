/* @flow */
import React, { Component } from 'react';
import { ColorPicker as RNColorPicker } from 'react-native-color-picker';
import styled from 'styled-components/native';

import Button from './Button';

const View = styled.View`
  flex: 1;
  background-color: #1c1c1c;
  margin-horizontal: 20;
  margin-vertical: 20;
  padding-horizontal: 20;
  padding-vertical: 20;
  border-radius: 5;
  border-width: 1;
  border-color: #525252;
`;

const ColorWrapper = styled.View`
  flex-direction: row;
  padding-bottom: 10;
`;

const Color = styled.View`
  border-radius: 5;
  flex: 1;
  height: 40;
  background-color: ${props => props.color};
`;

const Text = styled.Text`
  text-align: center;
  color: #525252;
`;

type Props = {
  onSend: Function,
  onClose: Function
};

type State = {
  color1: string,
  color2: string,
  status: string
};

class ColorPicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      color1: '',
      color2: '',
      status: 'Pick color first before hitting that button'
    };
  }

  onPressColor(color: string) {
    if (!this.state.color1) {
      console.log(color);
      this.setState({
        color1: color,
        status: 'Send'
      });
    }

    if (this.state.color1 && !this.state.color2) {
      console.log(color);
      this.setState({
        color2: color
      });
    }

    if (this.state.color1 && this.state.color2) {
      console.log(color);
      this.props.onSend({ color1: this.state.color1, color2: this.state.color2 });
      this.setState({
        color1: '',
        color2: ''
      });
    }
  }

  onPressClose() {
    this.props.onClose();
  }

  render() {
    const { color1, color2 } = this.state;
    return (
      <View>
        <RNColorPicker onColorSelected={color => this.onPressColor(color)} style={{ flex: 1 }} />
        <ColorWrapper>
          <Color color={color1 || 'transparent'} />
          <Color color={color2 || 'transparent'} />
        </ColorWrapper>
        <Button onPressOut={() => this.onPressClose()}>
          <Text>Close</Text>
        </Button>
      </View>
    );
  }
}

export default ColorPicker;
