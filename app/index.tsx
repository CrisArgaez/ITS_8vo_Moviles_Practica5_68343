import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import useNotes from '../hooks/useNotes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotesListScreen() {
  const router = useRouter();
  const { notes, isLoading, error, deleteNote, loadNotes } = useNotes();
  const [authChecked, setAuthChecked] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/login');
  };

  // Verifica si hay token
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login'); // Redirige a login si no hay token
      } else {
        setAuthChecked(true); // Continúa cargando notas si hay token
      }
    };
    checkAuth();
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      if (authChecked) {
        loadNotes(); // Solo carga las notas si la autenticación ha sido verificada
      }
    }, [authChecked, loadNotes])
  );

  const handleEditNote = (noteId: number) => {
    router.push(`/create-note?id=${noteId}`);
  };

  const handleDeleteNote = async (noteId: number) => {
    Alert.alert(
      'Eliminar Nota',
      '¿Estás seguro de que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la nota');
            }
          }
        }
      ]
    );
  };

  if (!authChecked) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botón de logout (ícono arriba a la derecha) */}
      <IconButton
        icon="logout"
        size={24}
        onPress={handleLogout}
        style={styles.logoutButton}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notes.length === 0 ? (
          <Text style={styles.emptyText}>No hay notas creadas</Text>
        ) : (
          notes.map(note => (
            <Card key={note.id} style={styles.card}>
              <Card.Title title={note.titulo} titleStyle={styles.cardTitle} />
              <Card.Content>
                <Text numberOfLines={3} ellipsizeMode="tail" style={styles.cardContent}>
                  {note.descripcion.replace(/<[^>]*>/g, '').substring(0, 200)}
                </Text>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <IconButton icon="pencil" size={24} onPress={() => handleEditNote(note.id)} />
                <IconButton icon="delete" size={24} onPress={() => handleDeleteNote(note.id)} />
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/create-note')}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
    color: '#555',
    marginTop: 8,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ee',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
});