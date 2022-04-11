import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {Component, useEffect, useMemo, useState} from 'react';

export default class TimerClass extends Component {
  interval = null;

  constructor(props) {
    super(props);
    this.state = {
      running: false,
      timeStart: null,
      current: 0,
      timeLaps: [],
    };
  }

  toggleStart = flag => {
    this.setState({
      running: flag,
      timeStart: flag === true ? Date.now() : null,
    });

    if (flag) {
      this.interval = setInterval(() => {
        this.setState({
          current: this.state.current + 1,
        });
      }, 1000);
    } else {
      if (this.interval) {
        clearInterval(this.interval);
        this.setState({current: 0, timeLaps: []});
      }
    }
  };

  addLap = () => {
    if (this.state.running) {
      const diff = Date.now() - this.state.timeStart;
      const newLap = [...this.state.timeLaps, diff];
      this.setState({
        timeLaps: newLap,
      });
    }
  };

  componentWillUnmount() {
    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
  render() {
    let seconds = Math.floor(this.state.current % 60);
    let minutes = Math.floor((this.state.current / 60) % 60);
    let hours = Math.floor((this.state.current / 3600) % 60);

    return (
      <View style={styles.wrap}>
        <View>
          <Text style={styles.time}>
            {this.state.running == false
              ? '00:00:00'
              : `${hours >= 10 ? hours : '0' + hours}:${
                  minutes >= 10 ? minutes : '0' + minutes
                }:${seconds >= 10 ? seconds : '0' + seconds}`}
          </Text>
        </View>
        <View style={styles.wrapBtn}>
          <TouchableOpacity style={styles.btn} onPress={this.addLap}>
            <Text style={styles.btnText}>Lap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.toggleStart(!this.state.running)}>
            <Text style={styles.btnText}>
              {this.state.running ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.wrapLap}>
          {this.state.timeLaps.map((item, index) => {
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
