import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const borderEmail = useRef(new Animated.Value(0)).current;
  const borderPassword = useRef(new Animated.Value(0)).current;

  const animateBorder = (animatedValue: Animated.Value, toValue: number) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Correo inválido', 'Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Contraseña inválida', 'Debe tener al menos 8 caracteres.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();
      await AsyncStorage.setItem('token', data.token);
      router.replace('/');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo iniciar sesión. Verifica tus datos.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Fondo estrellado */}
      <View style={styles.starsContainer}>
        {[...Array(40)].map((_, i) => (
          <View key={i} style={[styles.star, {
            top: Math.random() * 800,
            left: Math.random() * width,
            opacity: Math.random(),
            transform: [{ scale: Math.random() * 1.2 }],
          }]} />
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Bienvenido de vuelta</Text>

        <Animated.View style={[styles.inputContainer, {
          borderColor: borderEmail.interpolate({
            inputRange: [0, 1],
            outputRange: ['#333', '#9b5eff']
          }),
        }]}>
          <MaterialIcons name="email" color="#bbb" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#bbb"
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => animateBorder(borderEmail, 1)}
            onBlur={() => animateBorder(borderEmail, 0)}
            value={email}
            onChangeText={setEmail}
          />
        </Animated.View>

        <Animated.View style={[styles.inputContainer, {
          borderColor: borderPassword.interpolate({
            inputRange: [0, 1],
            outputRange: ['#333', '#9b5eff']
          }),
        }]}>
          <MaterialIcons name="lock" color="#bbb" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#bbb"
            secureTextEntry
            onFocus={() => animateBorder(borderPassword, 1)}
            onBlur={() => animateBorder(borderPassword, 0)}
            value={password}
            onChangeText={setPassword}
          />
        </Animated.View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c1d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#ffffffaa',
    borderRadius: 1,
  },
  card: {
    width: '85%',
    backgroundColor: '#1a1a2e',
    padding: 24,
    borderRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 14,
    paddingLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6c47ff',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 18,
  },
});
