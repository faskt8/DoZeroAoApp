
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar,
 TouchableOpacity, FlatList, Modal, TextInput, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import TaskList from './src/components/TaskList';

{/*Criação do componente para animação do botão, ele não pode ser usado como na View */}
const AnimatedButton = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {
    const [task, setTask] = useState([]);
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');

    //Buscando todas as tarefas ao iniciar o app
    useEffect(() => {
      async function loadTasks() {
        const taskStorage = await AsyncStorage.getItem('@task');

        if (taskStorage) {
          setTask(JSON.parse(taskStorage));
        }
      }

      loadTasks();

    }, []);

    //salvando caso tenha alguma tarefa alterada
    useEffect(() => {
      async function saveTasks() {
        await AsyncStorage.setItem('@task', JSON.stringify(task));
      }

      saveTasks();
    },[task]);

    function handleAdd() {
      if (input === '') return ;
      
      const data = {
        key: input,
        task: input
      };

      setTask([...task, data]);
      setOpen(false);
      setInput('');
    }

    const handleDelete = useCallback((data) => {
      const find = task.filter(r => r.key !== data.key);
      setTask(find);
    })
  return (
    <SafeAreaView style={styles.container}>
      {/* Deixar a status bar com a cor do App e icones brancos */}
      <StatusBar backgroundColor="#171d31" barStyle="light-content"/>

      <View style={styles.content}>
      <Text style={styles.title}>My Tasks</Text>
      </View>

      {/* Aqui será a lista de tarefas */}
      <FlatList 
        marginHorizontal={10}
        showsHorizontalScrollIndicator={false}
        data={task}
        keyExtractor={(item) => String(item.key)}
        renderItem={({ item }) => <TaskList data={ item } handleDelete={handleDelete} />}
      />
      
      <Modal animationType="slide" transparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={ () => setOpen(false)}>
              <Ionicons 
              style={{marginLeft: 5, marginRight: 5}} 
              name="md-arrow-back" size={30} 
              color='#FFF'
              />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              Nova Tarefa
            </Text>
          </View>

          <Animatable.View style={styles.modalBody}animation="fadeInUp" useNativeDriver>
            <TextInput
              multiline={true}
              placeholderTextColor='#747474'
              autoCorrect={false}
              placeholder="O que precisa fazer hoje ?"
              style={styles.input}
              value={input}
              onChangeText={(texto) => setInput(texto)}
            />

            <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
              <Text style={styles.handleAddText}>Cadastrar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </SafeAreaView>
      </Modal>
      
      {/* Botão add listas */}
      <AnimatedButton 
        style={styles.addButton}
        animation="bounceInUp"
        duration={1500}
        onPress={() => setOpen(true)}
        useNativeDriver
      >
        <Ionicons name="ios-add" size={30} color="#FFF"/>
      </AnimatedButton>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171d31',
  },

  title:{
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    textAlign: 'center',
    color: '#FFF',
  },

  addButton:{
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0094ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 40,
    bottom: 40,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3
    }
  },

  modal:{
    flex: 1,
    backgroundColor: '#171d31'
  },

  modalHeader:{
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },

  modalTitle:{
    marginLeft: 15,
    fontSize: 23,
    color: '#FFF'
  },

  modalBody:{
    marginTop: 15,
  },

  input:{
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    fontSize: 15,
    backgroundColor: '#FFF',
    padding: 9,
    height: 90,
    textAlignVertical: 'top',
    color: '#000',
    borderRadius: 5,
  },

  handleAdd:{
    backgroundColor: '#FFF',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5
  },

  handleAddText:{
    fontSize: 18
  }
});
