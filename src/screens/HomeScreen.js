import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

import { db } from "../firebase/config";

export default function HomeScreen() {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [workouts, setWorkouts] = useState([]);

  async function handleAddWorkout() {
    if (!exercise || !weight || !reps) {
      return;
    }

    await addDoc(collection(db, "workouts"), {
      exercise,
      weight,
      reps,
      createdAt: new Date()
    });

    setExercise("");
    setWeight("");
    setReps("");
  }

  useEffect(() => {
    const q = query(
      collection(db, "workouts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];

      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setWorkouts(list);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CargaPro</Text>

      <TextInput
        placeholder="Exercício"
        placeholderTextColor="#999"
        style={styles.input}
        value={exercise}
        onChangeText={setExercise}
      />

      <TextInput
        placeholder="Carga (kg)"
        placeholderTextColor="#999"
        style={styles.input}
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TextInput
        placeholder="Repetições"
        placeholderTextColor="#999"
        style={styles.input}
        keyboardType="numeric"
        value={reps}
        onChangeText={setReps}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddWorkout}
      >
        <Text style={styles.buttonText}>
          Salvar treino
        </Text>
      </TouchableOpacity>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.exercise}>
              {item.exercise}
            </Text>

            <Text style={styles.info}>
              {item.weight} kg • {item.reps} reps
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 60
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff3b30",
    marginBottom: 30,
    textAlign: "center"
  },

  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },

  button: {
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },

  card: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },

  exercise: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },

  info: {
    color: "#bbb",
    marginTop: 5
  }
});