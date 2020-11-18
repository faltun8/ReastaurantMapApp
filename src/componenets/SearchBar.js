import React from 'react';
import { View, TextInput } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome"

const SearchBar = (props) => {
    return ( 
        <View style={{flexDirection:'row'}}>
            <Icon name='search'/>
            <TextInput
                style={{paddingLeft:10}}
                placeholder='Enter A City Name'
                onChangeText={props.onSelect}
            />
        </View>
     );
}
 
export {SearchBar};