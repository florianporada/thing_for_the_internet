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
  onPressItem: Function
};

type State = {
  videos: Array<Object>,
  status: string
};

class ColorPicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      videos: [
        {
          key: 0,
          name: 'Identifikation',
          filename: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
        },
        {
          key: 1,
          name: 'Moovel Logo',
          filename: 'http://techslides.com/demos/sample-videos/small.mp4'
        },
        { key: 2, name: 'Timer Füllstand', filename: '' },
        { key: 3, name: 'Rotes Stoppen', filename: '' },
        { key: 4, name: 'Timer rotierend', filename: '' },
        { key: 5, name: 'Konversation Hey', filename: '' },
        { key: 6, name: 'Konversation OK', filename: '' },
        { key: 7, name: 'Blaues Atmen', filename: '' },
        { key: 8, name: 'Weißes Atmen', filename: '' },
        { key: 9, name: 'Rotes Stoppen', filename: '' },
        { key: 10, name: 'Abbremsen', filename: '' },
        { key: 11, name: 'Anfahren', filename: '' },
        { key: 12, name: 'Winken', filename: '' }
      ],
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
            data={this.state.videos}
            renderItem={({ item }) => (
              <ItemWrapper>
                <Button onPressOut={() => this.onPressItem(item)}>
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

export default ColorPicker;
