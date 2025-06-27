import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // ggf. Pfad anpassen

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    navigation.replace('MainApp');
  } catch (error) {
    Alert.alert('Login fehlgeschlagen', error.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SnapChamp Login</Text>

      <TextInput
        style={styles.input}
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Passwort"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Eingeloggt bleiben */}
      <Pressable onPress={() => setStayLoggedIn(!stayLoggedIn)} style={styles.checkboxRow}>
        <View style={[styles.checkbox, stayLoggedIn && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>Eingeloggt bleiben</Text>
      </Pressable>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Einloggen</Text>
      </TouchableOpacity>

      {/* ➕ Neu anmelden */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Noch kein Konto? Jetzt registrieren</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ffa500',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#aaa',
    marginRight: 8,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#ffa500',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  signupText: {
    marginTop: 12,
    fontSize: 14,
    color: '#007aff',
    textAlign: 'center',
  },
});

