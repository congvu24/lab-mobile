import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {Component, useEffect, useMemo, useState} from 'react';

export default function Timer() {
  const [current, setCurrent] = useState(0);
  const [running, setRunning] = useState(false);
  const [timeStart, setTimeStart] = useState('');
  const [timeLaps, setTimeLaps] = useState([]);

  const toggleStart = flag => {
    if (flag) {
      setRunning(true);
      setTimeStart(Date.now());
    } else {
      setRunning(false);
      setCurrent(0);
      setTimeLaps([]);
    }
  };

  const addLap = () => {
    if (running) {
      const diff = Date.now() - timeStart;
      const newLap = [...timeLaps, diff];

      setTimeLaps(newLap);
    }
  };

  useEffect(() => {
    if (running) {
      setTimeout(() => {
        setCurrent(current + 1);
      }, 1000);
    } else {
      setCurrent(0);
    }
  }, [running, current]);

  let seconds = Math.floor(current % 60);
  let minutes = Math.floor((current / 60) % 60);
  let hours = Math.floor((current / 3600) % 60);

  return (
    <View style={styles.wrap}>
      <View>
        <Text style={styles.time}>
          {running == false
            ? '00:00:00'
            : `${hours >= 10 ? hours : '0' + hours}:${
                minutes >= 10 ? minutes : '0' + minutes
              }:${seconds >= 10 ? seconds : '0' + seconds}`}
        </Text>
      </View>
      <View style={styles.wrapBtn}>
        <TouchableOpacity style={styles.btn} onPress={addLap}>
          <Text style={styles.btnText}>Lap</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => toggleStart(!running)}>
          <Text style={styles.btnText}>{running ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.wrapLap}>
        {timeLaps.map((item, index) => {
          const diff = item / 1000;
          let seconds = Math.floor(diff % 60);
          let minutes = Math.floor((diff / 60) % 60);
          let hours = Math.floor((diff / 3600) % 60);
          return (
            <View style={styles.lap} key={index}>
              <Text style={styles.time}>Lap #{index}</Text>
              <Text style={styles.time}>{`${
                hours >= 10 ? hours : '0' + hours
              }:${minutes >= 10 ? minutes : '0' + minutes}:${
                seconds >= 10 ? seconds : '0' + seconds
              }`}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  time: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 30,
    color: 'black',
  },
  wrapBtn: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
  },
  btn: {
    width: 70,
    height: 70,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  btnText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
  },
  wrapLap: {
    padding: 20,
    marginTop: 50,
  },
  lap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    borderWidth: 0.5,
    marginBottom: 10,
  },
});
