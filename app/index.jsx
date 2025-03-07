import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { data } from "../data/todos";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import { ThemeContext } from "@/context/ThemeContext";
import Octicons from '@expo/vector-icons/Octicons';
import Animated, { LinearTransition } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const [loaded, error] = useFonts({
    Inter_500Medium
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('TodoApp')
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;
        if (storageTodos && storageTodos.length) {
          setTodos(storageTodos.sort((a, b) => b.id - a.id))
        } else {
          setTodos(data.sort((a, b) => b.id - a.id))
        }
      } catch(e) {
        console.error(e)
      }
    }
    fetchData()
  }, [data])
  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem('TodoApp', JSON.stringify(todos))
      } catch (error) {
        console.error(error)
      }
    }
    storeData()
  }, [todos])
  if (!loaded && !error) return null;

  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const addTodo = () => {
    if (text.trim() === "") return;
    const newId = todos.length > 0 ? todos[0].id + 1 : 1;
    setTodos([{ id: newId, title: text, completed: false }, ...todos]);
    setText('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) => todo.id === id ? {...todo, completed: !todo.completed} : todo))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const renderItem = ({item}) => {
    return (
      <View style={styles.todoItem}>
        <Text style={[styles.todoText, item.completed && styles.completedText]} onPress={() => toggleTodo(item.id)}>{item.title}</Text>
        <Pressable onPress={() => deleteTodo(item.id)}>
          <AntDesign name="delete" size={36} color="red" selectable={undefined} />
        </Pressable>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Add a new todo" value={text} onChangeText={setText} />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
        <Pressable onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')} style={{ marginLeft: 10 }}>
          {colorScheme === 'dark' ? <Octicons name="sun" size={36} color={theme.text} selectable={undefined} /> : <Octicons name="moon" size={36} color={theme.text} selectable={undefined} />}
        </Pressable>
      </View>
      <Animated.FlatList
        data={todos}
        keyExtractor={(todo) => todo.id}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={renderItem}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}


function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      width: "100%",
      padding: 10,
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      marginRight: 10,
      fontSize: 18,
      fontFamily: "Inter_500Medium",
      minWidth: 0,
      color: theme.text,
      padding: 10,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'white',
    },
    todoItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      gap: 4,
      borderBottomWidth: 1,
      borderBottomColor: "gray",
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      color: theme.text,
      fontFamily: "Inter_500Medium",
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "gray",
    }
  })
}