/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, ScrollView, StatusBar} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

//Import react-navigation
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

// Imports the 2 different pages
import FirstPage from './components/basicDataViewer';
import SecondPage from './components/basicResultViewer';

//import all the screens we are going to switch
const App = createStackNavigator(
  {
    //Constant which holds all the screens like index of any book
    FirstPage: {screen: FirstPage},
    //First entry by default be our first screen if we do not define initialRouteName
    SecondPage: {screen: SecondPage},
  },
  {
    initialRouteName: 'FirstPage',
  },
);

export default createAppContainer(App);
