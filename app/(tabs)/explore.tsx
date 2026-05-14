import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const categorias = [
    { id: '1', nome: 'Peito', icone: 'fitness', exemplos: 'Supino, Crucifixo' },
    { id: '2', nome: 'Costas', icone: 'body', exemplos: 'Puxada Alta, Remada Baixa, Levantamento Terra' },
    { id: '3', nome: 'Pernas', icone: 'walk', exemplos: 'Agachamento, Leg Press, Extensora' },
    { id: '4', nome: 'Braços', icone: 'barbell', exemplos: 'Rosca Direta, Tríceps Pulley, Martelo' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Guia de Exercícios</Text>
      <Text style={styles.subtitle}>Consulte os principais movimentos para cada grupo muscular.</Text>

      {categorias.map((item) => (
        <View key={item.id} style={styles.categoryCard}>
          <View style={styles.iconContainer}>
            <Ionicons name={item.icone as any} size={30} color="#ff3b30" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.categoryName}>{item.nome}</Text>
            <Text style={styles.examples}>{item.exemplos}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#999', marginBottom: 30 },
  categoryCard: { backgroundColor: '#1e1e1e', padding: 20, borderRadius: 15, marginBottom: 15, flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 50, alignItems: 'center' },
  textContainer: { marginLeft: 15, flex: 1 },
  categoryName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  examples: { color: '#bbb', fontSize: 14, marginTop: 4 }
});