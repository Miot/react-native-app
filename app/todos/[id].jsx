import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, Pressable, TextInput } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext"
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const [todo, setTodo] = useState({});
  const router = useRouter();
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const [loaded, error] = useFonts({
    Inter_500Medium
  });

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const jsonValue = await AsyncStorage.getItem('TodoApp')
        const storageTodos = jsonValue!= null? JSON.parse(jsonValue) : null;
        if (storageTodos && storageTodos.length) {
          setTodo(storageTodos.find((todo) => todo.id === Number(id)))
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchData(id)
  }, [id])
  if (!loaded && !error) return null;
  const styles = createStyles(theme, colorScheme);

  const handleSave = async () => {
    try {
      const saveTodo = { ...todo, title: todo.title }
      const jsonValue = await AsyncStorage.getItem('TodoApp')
      const storageTodos = jsonValue!= null? JSON.parse(jsonValue) : null;
      if (storageTodos && storageTodos.length) {
        const updatedTodos = storageTodos.map((todo) => todo.id === Number(id)? saveTodo : todo)
        await AsyncStorage.setItem('TodoApp', JSON.stringify(updatedTodos))
        router.push('/')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput 
         style={styles.input}
         maxLength={30}
         placeholder="Edit todo" 
         placeholderTextColor="gray"
         value={todo?.title || ''}
         onChangeText={(text) => setTodo(prev => ({...prev, title: text}))}
        />
        <Pressable onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')} style={{ marginLeft: 10 }}>
          {colorScheme === 'dark' ? <Octicons name="sun" size={36} color={theme.text} selectable={undefined} /> : <Octicons name="moon" size={36} color={theme.text} selectable={undefined} />}
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <Pressable 
          onPress={handleSave}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable 
          onPress={() => router.push('/')}
          style={[styles.saveButton, {backgroundColor: 'red'}]}
        >
          <Text style={[styles.saveButtonText, {color: 'white'}]}>Cancel</Text>
        </Pressable>
      </View>
      <StatusBar style={colorScheme === 'dark'? 'light' : 'dark'} />
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
      padding: 10,
      gap: 6,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    input: {
      flex: 1,
      borderColor: 'gray',
      borderWidth: 1,
      bnoarderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      minWidth: 0,
      color: theme.text,
      font_family: 'Inter_500Medium',
    },
    saveButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    saveButtonText: {
      color: colorScheme === 'dark'? 'black' : 'white',
      fontSize: 18,
      font_family: 'Inter_500Medium',
    },
  })
}