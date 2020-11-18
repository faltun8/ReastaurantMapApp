import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {cityStyle} from '../styles'

const City = (props) => {
  return (
    <TouchableOpacity onPress={props.onSelect}>
        <View style={cityStyle.city} >
      <Text>{props.cityName}</Text>
    </View>
    </TouchableOpacity>
  );
};

export {City};
