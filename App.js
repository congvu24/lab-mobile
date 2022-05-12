/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState, useEffect} from 'react';
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

import {openDatabase, enablePromise} from 'react-native-sqlite-storage';

const tableName = 'user';

export const getDBConnection = async () => {
  return openDatabase({name: 'user-data.db', location: 'default'});
};

export const createTable = async db => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
        name TEXT NOT NULL,
        age INTEGER NOT NULL
    ) `;

  await db.executeSql(query);
};

enablePromise(true);

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
  const [filter, setFilter] = useState('');
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState('');
  const [editIndex, setEditIndex] = useState('');
  const [name, setName] = useState([]);
  const [age, setAge] = useState([]);

  const onSave = async () => {
    try {
      console.log('on save');
      if (name && age) {
        setData([...data, {age, name}]);
        setModalVisible(false);
        setName('');
        setAge('');
        const db = await getDBConnection();
        const insertQuery = `INSERT INTO ${tableName} (name, age) values ('${name}', ${age})`;

        await db.executeSql(insertQuery);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onUpdate = async () => {
    try {
      if (name && age) {
        let newData = data;
        let oldName = data[editIndex].name;
        data[editIndex] = {
          name,
          age,
        };

        setData(newData);

        setEditIndex('');
        setEdit('');
        setModalVisible(false);

        const db = await getDBConnection();
        const insertQuery = `UPDATE ${tableName} set name = '${name}', age = ${age} where name = '${oldName}'`;

        await db.executeSql(insertQuery);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = async index => {
    setData([...data.slice(0, index), ...data.slice(index + 1, data.length)]);

    const db = await getDBConnection();
    const deleteQuery = `DELETE from ${tableName} where name = ${data[index].name}`;
    await db.executeSql(deleteQuery);
  };

  const openEdit = index => {
    setEdit(data[index]);
    console.log('set', index)
    setEditIndex(index);
    setModalVisible(true);
    setName(data[index].name);
    setAge(data[index].age);
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    position: 'relative',
  };

  useEffect(() => {
    (async () => {
      const db = await getDBConnection();
      await createTable(db);
      const todoItems = [];
      const results = await db.executeSql(`SELECT name, age FROM ${tableName}`);
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          todoItems.push(result.rows.item(index));
        }
      });
      setData(todoItems);
    })();
  }, []);
  console.log(editIndex)
  console.log(String(editIndex) != '')
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <TextInput
          placeholder="Search user"
          style={styles.input}
          onChangeText={value => setFilter(value)}
        />
        <View style={styles.list}>
          {data.length > 0 &&
            data
              .filter(item => item.name.includes(filter))
              .map((item, index) => (
                <View style={styles.item} key={index}>
                  <View style={styles.itemText}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemTime}>{item.age}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={styles.itemIcon}
                      onPress={() => {
                        openEdit(index);
                      }}>
                      <Icon name="edit" size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.itemIcon}
                      onPress={() => {
                        deleteItem(index);
                      }}>
                      <Icon name="delete" size={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

          {data.length == 0 && (
            <Text style={{textAlign: 'center'}}>There is no user.</Text>
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
            <Text style={styles.modalTitle}>Add User</Text>
            <TextInput
              placeholder="Name"
              defaultValue={String(edit?.name)}
              style={styles.input}
              onChangeText={value => setName(value)}
            />
            <TextInput
              placeholder="Age"
              defaultValue={String(edit?.age)}
              style={styles.input}
              onChangeText={value => setAge(value)}
            />
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.footerBtn}
                onPress={() => setModalVisible(false)}>
                <Text>Close</Text>
              </TouchableOpacity>
              {String(editIndex) != '' && (
                <TouchableOpacity
                  style={{
                    ...styles.footerBtn,
                    backgroundColor: 'red',
                    marginLeft: 10,
                  }}
                  onPress={onUpdate}>
                  <Text>Update</Text>
                </TouchableOpacity>
              )}
              {String(editIndex) == '' && (
                <TouchableOpacity
                  style={{
                    ...styles.footerBtn,
                    backgroundColor: 'red',
                    marginLeft: 10,
                  }}
                  onPress={onSave}>
                  <Text>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
    margin: 10,
  },
  inputDescription: {
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
    margin: 10,
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
