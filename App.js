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
  const [data, setData] = useState(null); // array of data
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [city, setCity] = useState(undefined);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {}, []);

  const getMeteoFromApi = async () => {
    try {
      let res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=362f995a4976e6b570a29faf4b9558cd&units=metric&lang=fr`,
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
      );
      if (res.status === 200) {
        setData(res.data);
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
            onChangeText={setCity}
            value={city}
            placeholder="Veuillez saisir le nom d'une ville"
          />
          <Pressable style={styles.buttonSubmit} onPress={getMeteoFromApi}>
            <Text>Envoyer</Text>
          </Pressable>
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
    width: '30%',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: '#8fdee1',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBlock: {
    marginVertical: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
