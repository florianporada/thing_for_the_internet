/* @flow */
import React, { Component } from 'react';
import { ColorPicker as RNColorPicker } from 'react-native-color-picker';
import styled from 'styled-components/native';

import Button from './Button';

const View = styled.View`
  flex: 1;
  margin-horizontal: 20;
  margin-vertical: 20;
  padding-horizontal: 20;
  padding-vertical: 20;
  border-radius: 5;
  background-color: #1c1c1c;
`;

const ColorWrapper = styled.View`
  flex-direction: row;
`;

const Color = styled.View`
  flex: 1;
  height: 40;
  background-color: ${props => props.color};
`;

const Text = styled.Text`
  text-align: center;
  color: #525252;
`;

type Props = {
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
      status: 'Pick color first'
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
      this.setState({
        color1: color,
        color2: ''
      });
    }
  }

  onPressClose() {
    const { color1, color2 } = this.state;
    if (color1) {
      if (!color2) {
        this.props.onClose({ color1, color2: color1 });
      } else {
        this.props.onClose({ color1, color2 });
      }
    }
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
        <Button onPressIn={() => this.onPressClose()}>
          <Text>{this.state.status}</Text>
        </Button>
      </View>
    );
  }
}

export default ColorPicker;
