/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  Button,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';

const App: () => Node = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(undefined);
  const [cities, setCities] = useState(undefined);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const getCitySearch = async value => {
    try {
      if (value.length >= 3) {
        let res = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURI(
            value,
          )}&type=city&limit=3&format=json&apiKey=e7e8b57d0e91492ab555a084abd37c4c`,
          {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
            },
          },
        );
        if (res.status === 200) {
          let dirtyArray = res.data.results;
          let storedArray = [];
          dirtyArray.map(item => {
            storedArray = [
              ...storedArray,
              {
                name: item.city,
                lat: item.lat,
                lon: item.lon,
                state: item.state,
                country_code: item.country_code,
                country: item.country,
                id: `${item.city}, ${item.state}`,
              },
            ];
          });
          setCities(storedArray);
        }
      } else {
        console.error('une erreur est survenue');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMeteoFromApi = async item => {
    try {
      let res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${item.name},${item.country_code},${item.state}&appid=362f995a4976e6b570a29faf4b9558cd&units=metric&lang=fr`,
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
      );
      if (res.status === 200) {
        await setData(res.data);
        setCities(undefined);
        setLoading(false);
      } else {
        console.error('une erreur est survenue');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.viewMeteo}>
          <TextInput
            style={styles.input}
            onChangeText={value => {
              getCitySearch(value);
            }}
            value={city}
            placeholder="Veuillez saisir le nom d'une ville"
          />
          {cities !== undefined ? (
            cities.map(item => {
              return (
                <Pressable
                  key={item.name + item.lat}
                  style={styles.buttonSubmit}
                  onPressOut={() => getMeteoFromApi(item)}>
                  <Text style={{color: '#fff'}}>
                    {item.name} - {item.state} - {item.country}
                  </Text>
                </Pressable>
              );
            })
          ) : (
            <Text />
          )}
          {loading ? (
            <Text />
          ) : (
            <View>
              <Text style={styles.city}>{data?.name}</Text>
              <Text>Température actuelle : {data?.main?.temp}°C</Text>
              <Text>Température ressentie : {data?.main?.feels_like}°C</Text>
              <View style={styles.iconBlock}>
                <Image
                  style={styles.icon}
                  source={{
                    uri: `https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@4x.png`,
                  }}
                />
                <Text>{data?.weather[0]?.description}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewMeteo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  city: {
    fontSize: 25,
    marginVertical: 40,
    fontWeight: 'bold',
  },
  icon: {
    height: 200,
    width: 200,
  },
  input: {
    backgroundColor: '#c2c2c2',
    width: '90%',
    marginTop: 25,
    borderRadius: 15,
    paddingStart: 15,
  },
  buttonSubmit: {
    width: '90%',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: '#5b738f',
    padding: 10,
  },
  iconBlock: {
    marginVertical: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
