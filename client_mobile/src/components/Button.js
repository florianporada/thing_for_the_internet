/* @flow */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

type Props = {
  onPressIn: Function,
  onPressOut?: Function,
  children: any
};

const View = styled.View`
  border-radius: 5;
  border-width: 1;
  border-color: #525252
  padding-top: 15;
  padding-right: 15;
  padding-bottom: 15;
  padding-left: 15;
  margin-top: 5;
  margin-bottom: 5;
`;

const Button = (props: Props) => {
  return (
    <TouchableOpacity onPressIn={props.onPressIn} onPressOut={props.onPressOut}>
      <View>{props.children}</View>
    </TouchableOpacity>
  );
};

export default Button;
