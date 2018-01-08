/* @flow */
import React, { Component } from 'react';
import { PanResponder, Dimensions } from 'react-native';
import styled from "styled-components/native";

type Props = {
  onTouchMove: Function,
};

type State = {
  dimensions: {
    width: number,
    height: number,
  }
};

const View = styled.View`
  background-color: #525252;
  height: 300;
  border-radius: 5;
`

const toPercentage = (value: number, base: number) => {
  return ~~((value / base) * 100);
};

class Trackpad extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      dimensions: {
        height: 300,
        width: (Dimensions.get('window').width - 10)
      }
    }
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gs) => true,
      onMoveShouldSetPanResponderCapture: (e, gs) => true,
      onPanResponderMove: (e, gs) => {
        let x = toPercentage(e.nativeEvent.locationX, this.state.dimensions.width);
        let y = toPercentage(e.nativeEvent.locationY, this.state.dimensions.height);

        if (x > 100 || x < 0 || y > 100 || y < 0) return false;

        this.props.onTouchMove({ x, y })
      },
    });
  };

  render() {
    return (
      <View {...this.panResponder.panHandlers} />
    );
  }
};

export default Trackpad;
