/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState} from 'react';
import type {Node} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Button,
  Dimensions,
  DrawerLayoutAndroid,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/AntDesign';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [data, setData] = useState([]);
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState('left');
  const [showTodo, setShowTodo] = useState(true);
  const [doneList, setDoneList] = useState([]);

  const onChangeEnd = (event, value) => {
    setShowEnd(false);
    setTimeEnd(value);
  };

  const onChangeStart = (event, value) => {
    setShowStart(false);
    setTimeStart(value);
  };

  const onSave = () => {
    if (title && timeEnd && timeStart) {
      setData([
        ...data,
        {title, description, timeEnd, timeStart, isDone: false},
      ]);
      setModalVisible(false);
      setTimeEnd('');
      setTimeStart('');
      setTitle('');
      setDescription('');
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    position: 'relative',
  };

  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <Button
        title="Todo"
        style={{marginTop: 10}}
        onPress={() => {
          setShowTodo(true);
          drawer.current.closeDrawer();
        }}
      />
      <Button
        title="Done"
        style={{marginTop: 10}}
        onPress={() => {
          setShowTodo(false);
          drawer.current.closeDrawer();
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition={drawerPosition}
        renderNavigationView={navigationView}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <TouchableOpacity
            style={styles.header}
            onPress={() => drawer.current.openDrawer()}>
            <Icon name="menufold" size={20} />
            <Text style={styles.headerText}>To Do List</Text>
          </TouchableOpacity>

          <View style={styles.list}>
            {data.length > 0 &&
              showTodo &&
              data
                .filter(item => !doneList.includes(item))
                .map(item => (
                  <View style={styles.item} key={item.title + item.description}>
                    <View style={styles.itemText}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemTime}>
                        {new Date(item.timeStart)
                          .toLocaleTimeString()
                          .slice(0, 5)}{' '}
                        to{' '}
                        {new Date(item.timeEnd)
                          .toLocaleTimeString()
                          .slice(0, 5)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.itemIcon}
                      onPress={() => {
                        setDoneList([...doneList, item]);
                      }}>
                      <Icon name="checkcircleo" size={16} />
                    </TouchableOpacity>
                  </View>
                ))}
            {doneList.length > 0 &&
              !showTodo &&
              doneList.map(item => (
                <View style={styles.item} key={item.title + item.description}>
                  <View style={styles.itemText}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemTime}>
                      {new Date(item.timeStart)
                        .toLocaleTimeString()
                        .slice(0, 5)}{' '}
                      to{' '}
                      {new Date(item.timeEnd).toLocaleTimeString().slice(0, 5)}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.itemIcon}>
                    <Icon name="checkcircle" size={16} />
                  </TouchableOpacity>
                </View>
              ))}
            {data.length == 0 && (
              <Text style={{textAlign: 'center'}}>There is no note.</Text>
            )}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          style={styles.modal}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <SafeAreaView style={styles.modal}>
            <View style={styles.centeredView}>
              <Text style={styles.modalTitle}>Add Task</Text>
              <TextInput
                placeholder="Title"
                style={styles.input}
                onChangeText={value => setTitle(value)}
              />
              <TextInput
                placeholder="Description"
                style={styles.inputDescription}
                numberOfLines={5}
                onChangeText={value => setDescription(value)}
              />
              <View style={styles.timeWrap}>
                <TouchableOpacity
                  style={styles.timeBtn}
                  onPress={() => setShowStart(true)}>
                  <Text>
                    {timeStart
                      ? timeStart.toLocaleTimeString().slice(0, 5)
                      : 'Start time'}
                  </Text>
                </TouchableOpacity>
                {showStart && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={timeStart || new Date()}
                    mode="time"
                    is24Hour={true}
                    onChange={onChangeStart}
                  />
                )}
                <TouchableOpacity
                  style={styles.timeBtn}
                  onPress={() => setShowEnd(true)}>
                  <Text>
                    {timeEnd
                      ? timeEnd.toLocaleTimeString().slice(0, 5)
                      : 'End time'}
                  </Text>
                </TouchableOpacity>
                {showEnd && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={timeEnd || new Date()}
                    mode="time"
                    is24Hour={true}
                    onChange={onChangeEnd}
                  />
                )}
              </View>
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.footerBtn}
                  onPress={() => setModalVisible(false)}>
                  <Text>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.footerBtn,
                    backgroundColor: 'red',
                    marginLeft: 10,
                  }}
                  onPress={onSave}>
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </DrawerLayoutAndroid>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerBtn: {
    borderWidth: 1,
    padding: 10,
    borderColor: 'black',
    alignItems: 'center',
    width: 100,
    borderRadius: 5,
  },
  timeWrap: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeBtn: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderColor: 'black',
    backgroundColor: 'red',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
  },
  inputDescription: {
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
    // height: 100,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  centeredView: {
    width: 300,
    height: 500,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  addBtn: {
    position: 'absolute',
    backgroundColor: 'red',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
    bottom: 50,
    zIndex: 10000,
  },
  list: {
    marginTop: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#ebdcb2',
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
  },
  itemText: {},
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  itemIcon: {
    width: 30,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
