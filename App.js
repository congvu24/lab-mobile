import {View, Text} from 'react-native';
import React from 'react';
import TimerClass from './TimerClass';
import Timer from './Timer';

export default function App() {
  return (
    <View style={{flex: 1}}>
      <TimerClass />
      {/* <Timer /> */}
    </View>
  );
}
