import Axios from 'axios';
import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, View, Text, FlatList} from 'react-native';

import MapView, {Marker} from 'react-native-maps';

import {City, RestaurantDetail, SearchBar} from './componenets';
import {searchBarStyle, mapStyle} from './styles';

let originalList = [];

const Main = (props) => {
  const [cityList, setCityList] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const mapRef = useRef(null);
  const [modalFlag, setModalFlag] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');

  const fetchCities = async () => {
    const {data} = await Axios.get(
      'https://opentable.herokuapp.com/api/cities',
    );
    setCityList(data.cities);
    originalList = [...data.cities];
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const renderCityName = (item) => {
    return <City cityName={item} onSelect={() => onCitySelect(item)} />;
  };

  const onCitySelect = async (city) => {
    const {
      data: {restaurants},
    } = await Axios.get(
      'https://opentable.herokuapp.com/api/restaurants?city=' + city,
    );

    setRestaurants(restaurants);

    const restaurantCoordinates = restaurants.map((res) => {
      return {
        latitude: res.lat,
        longitude: res.lng,
      };
    });
    mapRef.current.fitToCoordinates(restaurantCoordinates, {
      edgePadding: {
        top: 120,
        right: 30,
        left: 30,
        bottom: 30,
      },
    });
  };

  const onCitySearch = (text) => {
    const filteredList = originalList.filter((item) => {
      const userText = text.toUpperCase();
      const cityName = item.toUpperCase();
      return cityName.indexOf(userText) > -1;
    });

    setCityList(filteredList);
  };

  const onRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setModalFlag(true);
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <MapView
          customMapStyle={mapStyle}
          ref={mapRef}
          style={{flex: 1}}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {restaurants.map((r, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: r.lat,
                longitude: r.lng,
              }}
              onPress={() => onRestaurantSelect(r)}
            />
          ))}
        </MapView>
        <View style={searchBarStyle.container}>
          <View style={searchBarStyle.input}>
            <SearchBar onSelect={onCitySearch} />
          </View>
          <View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              keyExtractor={(_, index) => index.toString()}
              data={cityList}
              renderItem={({item}) => renderCityName(item)}
            />
            <RestaurantDetail
              isVisible={modalFlag}
              restaurant={selectedRestaurant}
              onClose={() => setModalFlag(false)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Main;
