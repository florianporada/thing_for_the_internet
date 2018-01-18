/* @flow */
import React, { Component } from 'react';
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

const ItemWrapper = styled.View``;

const ScrollView = styled.ScrollView`
  padding-right: 50;
`;

const FlatList = styled.FlatList``;

const Text = styled.Text`
  text-align: center;
  color: #525252;
`;

type Props = {
  onClose: Function,
  onPressItem: Function,
  animations: Array<Object>
};

type State = {
  animations: Array<Object>,
  status: string
};

class VideoList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      animations: props.animations,
      status: 'Pick video first'
    };
  }

  onPressClose() {
    this.props.onClose();
  }

  onPressItem(item: Object) {
    this.props.onPressItem(item);
  }

  render() {
    return (
      <View>
        <ScrollView>
          <FlatList
            data={this.state.animations}
            renderItem={({ item, index }) => (
              <ItemWrapper>
                <Button onPressOut={() => this.onPressItem({ ...item, index })}>
                  <Text>{item.name}</Text>
                </Button>
              </ItemWrapper>
            )}
          />
        </ScrollView>
        <Button onPressOut={() => this.onPressClose()}>
          <Text>Close</Text>
        </Button>
      </View>
    );
  }
}

export default VideoList;
