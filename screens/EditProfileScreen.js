import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../AppContext';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { profile, setProfile } = useContext(AppContext); // 🔁 Zugriff auf Context

  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [website, setWebsite] = useState(profile.website);
  const [imageUri, setImageUri] = useState(profile.imageUri);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveChanges = () => {
    setProfile({
      username,
      bio,
      location,
      website,
      imageUri,
    });

    Alert.alert('✅ Gespeichert', 'Dein Profil wurde aktualisiert');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profil bearbeiten</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={imageUri ? { uri: imageUri } : require('../assets/profile.jpg')}
          style={styles.profilePic}
        />
        <Text style={styles.changePhoto}>📷 Foto ändern</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Nutzername"
      />

      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={setBio}
        placeholder="Über mich / Bio"
        multiline
      />

      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Standort (optional)"
      />

      <TextInput
        style={styles.input}
        value={website}
        onChangeText={setWebsite}
        placeholder="Website oder Social Link"
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveText}>💾 Speichern</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Zurück zum Profil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 8,
  },
  changePhoto: {
    color: '#007bff',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backText: {
    color: '#444',
    marginTop: 20,
    fontSize: 14,
  },
});
