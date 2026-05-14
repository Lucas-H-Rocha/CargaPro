import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Keyboard,
  Platform
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Utilizando ícones já instalados no projeto

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc
} from "firebase/firestore";

import { db } from "../firebase/config"; // Importação da configuração do Firebase

export default function HomeScreen() {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [workouts, setWorkouts] = useState([]);

  // Função para adicionar um novo treino ao Firestore
  async function handleAddWorkout() {
    if (!exercise || !weight || !reps) {
      if (Platform.OS === 'web') {
        window.alert("Por favor, preenche todos os campos.");
      } else {
        Alert.alert("Atenção", "Por favor, preenche todos os campos.");
      }
      return;
    }

    try {
      await addDoc(collection(db, "workouts"), {
        exercise,
        weight,
        reps,
        createdAt: new Date()
      });

      setExercise("");
      setWeight("");
      setReps("");
      Keyboard.dismiss();
    } catch (error) {
      console.error("Erro ao adicionar:", error);
    }
  }

  // Função para remover um treino (Adaptada para Web e Mobile)
  async function handleDeleteWorkout(id) {
    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm("Deseja apagar este registo?");
      if (confirmDelete) {
        try {
          await deleteDoc(doc(db, "workouts", id));
        } catch (error) {
          console.error("Erro ao apagar:", error);
        }
      }
    } else {
      Alert.alert(
        "Eliminar",
        "Tens a certeza que queres apagar este registo?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Apagar", 
            style: "destructive",
            onPress: async () => {
              try {
                await deleteDoc(doc(db, "workouts", id));
              } catch (error) {
                console.error("Erro ao apagar:", error);
              }
            }
          }
        ]
      );
    }
  }

  // Hook para carregar os dados em tempo real
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

      <View style={styles.row}>
        <TextInput
          placeholder="Carga (kg)"
          placeholderTextColor="#999"
          style={[styles.input, styles.halfInput]}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <TextInput
          placeholder="Repetições"
          placeholderTextColor="#999"
          style={[styles.input, styles.halfInput]}
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
        />
      </View>

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
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          // Cálculo do Volume de Treino para cada card
          const volumeTotal = (parseFloat(item.weight) || 0) * (parseInt(item.reps) || 0);

          return (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.exercise}>
                  {item.exercise}
                </Text>
                <Text style={styles.info}>
                  {item.weight} kg • {item.reps} reps
                </Text>
                <Text style={styles.volumeText}>
                  Volume: {volumeTotal} kg
                </Text>
              </View>
              
              <TouchableOpacity onPress={() => handleDeleteWorkout(item.id)}>
                <Ionicons name="trash-outline" size={24} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          );
        }}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  halfInput: {
    width: "48%"
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
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardInfo: {
    flex: 1
  },
  exercise: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  info: {
    color: "#bbb",
    marginTop: 5
  },
  volumeText: {
    color: "#4CAF50",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "bold"
  }
});